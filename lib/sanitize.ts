// =============================================================================
// lib/sanitize.ts — Input sanitisation for security
// =============================================================================
// SECURITY: This is the first line of defense against:
// 1. XSS — strips all HTML/script tags before content reaches the UI
// 2. Prompt Injection — removes control characters and common injection patterns
// 3. Prompt Stuffing — enforces a hard character limit to prevent token abuse
//
// This function MUST be called server-side in API routes before passing
// user input to Gemini or rendering it in responses.
// =============================================================================

/** Maximum allowed input length (characters). Prevents token-stuffing attacks. */
const MAX_INPUT_LENGTH = 500;

/**
 * Patterns commonly used in prompt injection attempts against LLMs.
 * These are stripped from user input before it reaches the model.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /you\s+are\s+now\s+/gi,
  /system\s*:\s*/gi,
  /\[\s*INST\s*\]/gi,
  /<<\s*SYS\s*>>/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
];

/**
 * Sanitises user input for safe consumption by the AI model and UI.
 *
 * Processing pipeline:
 * 1. Trim whitespace
 * 2. Strip all HTML tags (prevents XSS if content is ever rendered)
 * 3. Remove ASCII control characters (0x00-0x1F except newline/tab)
 * 4. Strip known prompt injection patterns
 * 5. Collapse excessive whitespace
 * 6. Enforce maximum length (hard truncate)
 *
 * @param input — Raw user input string
 * @returns Sanitised string safe for model consumption
 */
export function sanitizeInput(input: string): string {
  let sanitized = input.trim();

  // Step 1: Strip all HTML tags (greedy match across newlines)
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Step 2: Remove HTML entities that could be used to bypass tag stripping
  sanitized = sanitized
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, ""); // Second pass after entity decode

  // Step 3: Remove ASCII control characters (keep \n and \t for formatting)
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Step 4: Strip common prompt injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }

  // Step 5: Collapse multiple spaces/newlines into single space
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  // Step 6: Enforce maximum length (hard truncate, don't throw)
  if (sanitized.length > MAX_INPUT_LENGTH) {
    sanitized = sanitized.slice(0, MAX_INPUT_LENGTH);
  }

  return sanitized;
}
