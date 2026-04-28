// =============================================================================
// app/api/translate/route.ts — Google Cloud Translation v2 Endpoint
// =============================================================================
// SECURITY: API key stays server-side. Client sends text + target language,
// server proxies to Google Translate and returns results.
//
// Uses the Basic (v2) REST API — no SDK needed.
// Endpoint: https://translation.googleapis.com/language/translate/v2
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import type { TranslateRequest, TranslateResponse, ApiError } from "@/lib/types";

/** Google Cloud Translation v2 REST endpoint */
const TRANSLATE_API_URL =
  "https://translation.googleapis.com/language/translate/v2";

/** Maximum number of text segments per request (prevent abuse) */
const MAX_TEXTS_PER_REQUEST = 20;

/** Maximum character length per text segment */
const MAX_TEXT_LENGTH = 2000;

/** Valid target language codes we support */
const VALID_LANGUAGES = new Set(["en", "hi", "bn", "mr", "te"]);

export async function POST(request: NextRequest) {
  try {
    // -------------------------------------------------------------------------
    // 1. Validate API key
    // -------------------------------------------------------------------------
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.error("[translate/route] GOOGLE_TRANSLATE_API_KEY is not configured");
      return NextResponse.json<ApiError>(
        { code: "CONFIG_ERROR", message: "Translation service is not configured" },
        { status: 503 }
      );
    }

    // -------------------------------------------------------------------------
    // 2. Parse and validate request
    // -------------------------------------------------------------------------
    let body: TranslateRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiError>(
        { code: "INVALID_JSON", message: "Request body must be valid JSON" },
        { status: 400 }
      );
    }

    const { texts, targetLang } = body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json<ApiError>(
        { code: "MISSING_TEXTS", message: "texts array is required and cannot be empty" },
        { status: 400 }
      );
    }

    if (texts.length > MAX_TEXTS_PER_REQUEST) {
      return NextResponse.json<ApiError>(
        {
          code: "TOO_MANY_TEXTS",
          message: `Maximum ${MAX_TEXTS_PER_REQUEST} text segments per request`,
        },
        { status: 400 }
      );
    }

    if (!VALID_LANGUAGES.has(targetLang)) {
      return NextResponse.json<ApiError>(
        { code: "INVALID_LANGUAGE", message: `Unsupported language: ${targetLang}` },
        { status: 400 }
      );
    }

    // If target is English, no translation needed — return as-is
    if (targetLang === "en") {
      return NextResponse.json<TranslateResponse>({ translations: texts });
    }

    // -------------------------------------------------------------------------
    // 3. Sanitise text inputs (truncate overly long segments)
    // -------------------------------------------------------------------------
    const sanitizedTexts = texts.map((t) =>
      typeof t === "string" ? t.slice(0, MAX_TEXT_LENGTH) : ""
    );

    // -------------------------------------------------------------------------
    // 4. Call Google Cloud Translation v2 REST API
    // -------------------------------------------------------------------------
    const translateResponse = await fetch(
      `${TRANSLATE_API_URL}?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: sanitizedTexts,
          target: targetLang,
          format: "text",
        }),
      }
    );

    if (!translateResponse.ok) {
      const errorText = await translateResponse.text();
      console.error(
        "[translate/route] Google Translate API error:",
        translateResponse.status,
        errorText
      );

      return NextResponse.json<ApiError>(
        { code: "TRANSLATE_ERROR", message: "Translation service is temporarily unavailable" },
        { status: 502 }
      );
    }

    // -------------------------------------------------------------------------
    // 5. Parse and return translations
    // -------------------------------------------------------------------------
    const data = await translateResponse.json();
    const translations: string[] =
      data?.data?.translations?.map(
        (t: { translatedText: string }) => t.translatedText
      ) ?? [];

    // Verify we got the same number of translations as inputs
    if (translations.length !== sanitizedTexts.length) {
      console.error(
        "[translate/route] Translation count mismatch:",
        translations.length,
        "vs",
        sanitizedTexts.length
      );
      return NextResponse.json<ApiError>(
        { code: "TRANSLATE_MISMATCH", message: "Translation returned unexpected results" },
        { status: 502 }
      );
    }

    return NextResponse.json<TranslateResponse>({ translations });
  } catch (error) {
    console.error("[translate/route] Unexpected error:", error);
    return NextResponse.json<ApiError>(
      { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
