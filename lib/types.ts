// =============================================================================
// lib/types.ts — Central type definitions (no `any` types)
// =============================================================================

/** The 5 supported Indian languages */
export type SupportedLanguage = "en" | "hi" | "bn" | "mr" | "te";

/** Human-readable labels per language */
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা",
  mr: "मराठी",
  te: "తెలుగు",
};

/** One string per supported language */
export type TranslatedText = Record<SupportedLanguage, string>;

/** Unique ID for each election phase */
export type ElectionStepId = "registration" | "research" | "polling" | "counting";

/** A single phase in the election timeline */
export interface ElectionStep {
  id: ElectionStepId;
  order: number;
  title: TranslatedText;
  description: TranslatedText;
  icon: string;
  checklist: TranslatedText[];
  showMap: boolean;
}

/** A single quiz question with i18n support */
export interface QuizQuestion {
  question: TranslatedText;
  options: TranslatedText[];
  correctIndex: number;
  explanation: TranslatedText;
}

/** Chat message role */
export type ChatRole = "user" | "assistant" | "system";

/** AI-triggered UI actions — strictly typed union */
export type StepAction =
  | "show_voter_id_checklist"
  | "show_evm_guide"
  | "navigate_to_step"
  | "show_map"
  | null;

/** A single chat message */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  action?: StepAction;
  checklist?: string[];
}

/** Structured Gemini API response */
export interface GeminiResponse {
  text: string;
  action: StepAction;
  checklist: string[];
}

