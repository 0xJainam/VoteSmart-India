// =============================================================================
// app/api/chat/route.ts — Gemini AI Chat Endpoint (Server-side only)
// =============================================================================
// SECURITY ARCHITECTURE:
// 1. API key lives in process.env — never reaches the client bundle
// 2. User input is sanitised before reaching the model
// 3. Structured JSON output enforced via Gemini's response_schema
// 4. No heavy SDK — uses native fetch to the REST endpoint (~0 bytes overhead)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitize";
import { getSystemPrompt } from "@/lib/prompts";
import { GEMINI_MODEL } from "@/lib/constants";
import type {
  ChatRequest,
  GeminiResponse,
  ElectionStepId,
  ApiError,
  ChatMessage,
} from "@/lib/types";

/** Gemini REST API base URL */
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_TIMEOUT_MS = 15000;
const MAX_HISTORY = 10;
const MAX_MESSAGE_CHARS = 1200;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

/**
 * JSON schema enforced on Gemini's output.
 * This guarantees the response matches our GeminiResponse interface,
 * so the frontend can reliably parse actions and checklists.
 */
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    text: {
      type: "string",
      description: "The conversational reply to the user",
    },
    action: {
      type: "string",
      nullable: true,
      description:
        "UI action to trigger: show_voter_id_checklist, show_evm_guide, navigate_to_step, show_map, or null",
    },
    checklist: {
      type: "array",
      items: { type: "string" },
      description: "Optional checklist items for the user",
    },
  },
  required: ["text", "action", "checklist"],
};

/** Valid step IDs for input validation */
const VALID_STEP_IDS: ElectionStepId[] = [
  "registration",
  "research",
  "polling",
  "counting",
];

type HistoryItem = Pick<ChatMessage, "role" | "content">;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRateLimitFallback(stepId: ElectionStepId): GeminiResponse {
  const fallbackByStep: Record<ElectionStepId, string> = {
    registration:
      "I'm temporarily rate-limited, but I can still help. For voter registration, check eligibility (18+), submit Form 6 on NVSP, and verify your name on electoralsearch.eci.gov.in.",
    research:
      "I'm temporarily rate-limited, but here's a quick guide: review candidate affidavits on MyNeta.info, compare manifestos, and check track records before voting.",
    polling:
      "I'm temporarily rate-limited, but here are essentials: carry valid photo ID, locate your polling station, vote on EVM, verify VVPAT, and follow booth rules.",
    counting:
      "I'm temporarily rate-limited, but you can follow official counting updates on results.eci.gov.in and track round-wise trends from the Election Commission.",
  };

  return {
    text: `${fallbackByStep[stepId]} Please retry in about 20-30 seconds for a full AI response.`,
    action: null,
    checklist: [],
  };
}

function normaliseHistory(history: unknown): HistoryItem[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item): item is HistoryItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<HistoryItem>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-MAX_HISTORY);
}

async function callGeminiWithRetry(
  endpoint: string,
  payload: object,
  attempts = 3,
): Promise<Response> {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (
        response.ok ||
        !RETRYABLE_STATUSES.has(response.status) ||
        attempt === attempts
      ) {
        return response;
      }
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }

    const backoffMs =
      400 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 200);
    await sleep(backoffMs);
  }

  if (lastError) throw lastError;
  throw new Error("Gemini request failed after retries");
}

export async function POST(request: NextRequest) {
  try {
    // -------------------------------------------------------------------------
    // 1. Validate API key exists (fail fast, don't leak error details)
    // -------------------------------------------------------------------------
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[chat/route] GEMINI_API_KEY is not configured");
      return NextResponse.json<ApiError>(
        { code: "CONFIG_ERROR", message: "AI service is not configured" },
        { status: 503 },
      );
    }

    // -------------------------------------------------------------------------
    // 2. Parse and validate request body
    // -------------------------------------------------------------------------
    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiError>(
        { code: "INVALID_JSON", message: "Request body must be valid JSON" },
        { status: 400 },
      );
    }

    const { message, currentStepId, history = [], language = "en" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json<ApiError>(
        { code: "MISSING_MESSAGE", message: "Message field is required" },
        { status: 400 },
      );
    }

    if (message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json<ApiError>(
        {
          code: "MESSAGE_TOO_LONG",
          message: `Message exceeds max length of ${MAX_MESSAGE_CHARS} characters`,
        },
        { status: 400 },
      );
    }

    // Validate step ID to prevent arbitrary system prompt injection
    const stepId: ElectionStepId = VALID_STEP_IDS.includes(currentStepId)
      ? currentStepId
      : "registration";

    // -------------------------------------------------------------------------
    // 3. SECURITY: Sanitise user input before passing to model
    // -------------------------------------------------------------------------
    const sanitizedMessage = sanitizeInput(message);

    if (sanitizedMessage.length === 0) {
      return NextResponse.json<ApiError>(
        {
          code: "EMPTY_MESSAGE",
          message: "Message is empty after sanitization",
        },
        { status: 400 },
      );
    }

    // -------------------------------------------------------------------------
    // 4. Build the Gemini API request
    // -------------------------------------------------------------------------
    const systemPrompt = getSystemPrompt(stepId, language);

    // Convert chat history to Gemini's format (limit to prevent token abuse)
    const recentHistory = normaliseHistory(history);

    const contents = [
      // Inject prior conversation turns for context
      ...recentHistory.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      // Current user message (sanitised)
      {
        role: "user",
        parts: [{ text: sanitizedMessage }],
      },
    ];

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        response_mime_type: "application/json",
        response_schema: RESPONSE_SCHEMA,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    // -------------------------------------------------------------------------
    // 5. Call Gemini REST API (native fetch — zero SDK overhead)
    // -------------------------------------------------------------------------
    const endpoint = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const geminiResponse = await callGeminiWithRetry(endpoint, geminiPayload);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(
        "[chat/route] Gemini API error:",
        geminiResponse.status,
        errorText,
      );

      // Graceful degradation for rate limiting keeps chat usable under quota spikes.
      if (geminiResponse.status === 429) {
        return NextResponse.json<GeminiResponse>(getRateLimitFallback(stepId));
      }

      return NextResponse.json<ApiError>(
        {
          code: "GEMINI_ERROR",
          message: "AI service is temporarily unavailable. Please try again.",
        },
        { status: 502 },
      );
    }

    // -------------------------------------------------------------------------
    // 6. Parse structured response
    // -------------------------------------------------------------------------
    const geminiData = await geminiResponse.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // If structured output parsing fails, wrap raw text as plain response
      const fallback: GeminiResponse = {
        text: rawText || "I apologize, I could not process that request.",
        action: null,
        checklist: [],
      };
      return NextResponse.json<GeminiResponse>(fallback);
    }

    const parsedObj = parsed as Partial<GeminiResponse>;
    const safeResponse: GeminiResponse = {
      text:
        typeof parsedObj.text === "string" && parsedObj.text.trim().length > 0
          ? parsedObj.text
          : "I apologize, I could not process that request.",
      action:
        parsedObj.action === "show_voter_id_checklist" ||
        parsedObj.action === "show_evm_guide" ||
        parsedObj.action === "navigate_to_step" ||
        parsedObj.action === "show_map"
          ? parsedObj.action
          : null,
      checklist: Array.isArray(parsedObj.checklist)
        ? parsedObj.checklist
            .filter((item): item is string => typeof item === "string")
            .slice(0, 10)
        : [],
    };

    return NextResponse.json<GeminiResponse>(safeResponse);
  } catch (error) {
    console.error("[chat/route] Unexpected error:", error);
    return NextResponse.json<ApiError>(
      { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
