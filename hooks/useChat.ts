import { useState, useCallback, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL, CHAT_COOLDOWN_MS, CHAT_RETRY_DELAY_MS, MAX_CHAT_HISTORY, UI_LABELS } from "@/lib/constants";
import { getSystemPrompt } from "@/lib/prompts";
import { sanitizeInput } from "@/lib/sanitize";
import type { ChatMessage, ElectionStepId, SupportedLanguage, GeminiResponse, TranslatedText } from "@/lib/types";

function msgId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function t(text: TranslatedText, lang: SupportedLanguage): string {
  return text[lang] || text.en;
}

let genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
    if (!key) throw new Error("Gemini API key is not configured. Set NEXT_PUBLIC_GEMINI_API_KEY in .env");
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

export interface UseChatProps {
  currentStep: ElectionStepId;
  language: SupportedLanguage;
}

export function useChat({ currentStep, language }: UseChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content: t(UI_LABELS.chat_greeting, language),
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  // Update greeting when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === "greeting"
          ? { ...m, content: t(UI_LABELS.chat_greeting, language) }
          : m
      )
    );
  }, [language]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || cooldown) return;

    const userMessage: ChatMessage = {
      id: msgId(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Cooldown to prevent rapid clicks
    setCooldown(true);
    setTimeout(() => setCooldown(false), CHAT_COOLDOWN_MS);

    try {
      // Sanitize input client-side
      const sanitized = sanitizeInput(trimmed);
      if (!sanitized) throw new Error("Message was empty after sanitization.");

      // Build conversation history
      let history = messages
        .filter((m) => m.id !== "greeting" && m.role !== "system")
        .slice(-MAX_CHAT_HISTORY)
        .map((m) => ({
          role: m.role === "assistant" ? "model" as const : "user" as const,
          parts: [{ text: m.content }],
        }));

      while (history.length > 0 && history[0].role === "model") {
        history = history.slice(1);
      }

      const model = getGenAI().getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: getSystemPrompt(currentStep, language),
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      // Exponential backoff
      let rawText = "";
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const chat = model.startChat({ history });
          const result = await chat.sendMessage(sanitized);
          rawText = result.response.text();
          break; // Success
        } catch (err) {
          const is429 = err instanceof Error && err.message.includes("429");
          if (is429 && attempt < 2) {
            const waitMs = CHAT_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
            console.warn(`[useChat] 429 rate limit hit. Retrying in ${waitMs}ms (attempt ${attempt}/2)`);
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          throw err;
        }
      }

      // Parse JSON response
      let data: GeminiResponse;
      try {
        const parsed = JSON.parse(rawText) as Partial<GeminiResponse>;
        data = {
          text: typeof parsed.text === "string" && parsed.text.trim() ? parsed.text : rawText,
          action: parsed.action ?? null,
          checklist: Array.isArray(parsed.checklist)
            ? parsed.checklist.filter((i): i is string => typeof i === "string").slice(0, 10)
            : [],
        };
      } catch {
        data = { text: rawText || "I could not process that request.", action: null, checklist: [] };
      }

      const assistantMessage: ChatMessage = {
        id: msgId(),
        role: "assistant",
        content: data.text,
        timestamp: new Date().toISOString(),
        action: data.action,
        checklist: data.checklist?.length ? data.checklist : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("[useChat] Gemini SDK error:", error);
      const errorMsg =
        error instanceof Error && error.message.includes("429")
          ? "VoteSmart hit its rate limit. Please wait ~30 seconds and try again."
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred";
      setMessages((prev) => [
        ...prev,
        {
          id: msgId(),
          role: "assistant",
          content: `⚠️ ${errorMsg}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, cooldown, messages, currentStep, language]);

  return {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    cooldown,
    sendMessage,
  };
}
