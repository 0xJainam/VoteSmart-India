"use client";

// =============================================================================
// components/ChatPanel.tsx — AI Chat Interface (Client-side Gemini SDK)
// =============================================================================
// Uses @google/generative-ai SDK directly from the browser for static export.
// System prompts are injected per-step via getSystemPrompt().
// =============================================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, MessageCircle, X, Loader, Check } from "./Icons";
import MapEmbed from "./MapEmbed";
import { UI_LABELS, GEMINI_MODEL } from "@/lib/constants";
import { getSystemPrompt } from "@/lib/prompts";
import { sanitizeInput } from "@/lib/sanitize";
import type {
  ChatMessage,
  ElectionStepId,
  SupportedLanguage,
  GeminiResponse,
  TranslatedText,
} from "@/lib/types";

interface ChatPanelProps {
  currentStep: ElectionStepId;
  language: SupportedLanguage;
}

/** Generate a unique ID for messages */
function msgId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function t(text: TranslatedText, lang: SupportedLanguage): string {
  return text[lang] || text.en;
}

/** Lazily initialised Gemini client (singleton) */
let genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
    if (!key) throw new Error("Gemini API key is not configured. Set NEXT_PUBLIC_GEMINI_API_KEY in .env");
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

export default function ChatPanel({ currentStep, language }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: msgId(),
      role: "assistant",
      content: t(UI_LABELS.chat_greeting, language),
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update greeting when language changes
  useEffect(() => {
    setMessages((prev) => {
      // Only update if we still have just the initial greeting message
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [
          {
            ...prev[0],
            content: t(UI_LABELS.chat_greeting, language),
          },
        ];
      }
      return prev;
    });
  }, [language]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: msgId(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Sanitize input client-side
      const sanitized = sanitizeInput(trimmed);
      if (!sanitized) throw new Error("Message was empty after sanitization.");

      // Build conversation history for context
      const history = messages
        .filter((m) => m.role !== "system")
        .slice(-10)
        .map((m) => ({
          role: m.role === "assistant" ? "model" as const : "user" as const,
          parts: [{ text: m.content }],
        }));

      // Call Gemini SDK directly
      const model = getGenAI().getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: getSystemPrompt(currentStep, language),
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(sanitized);
      const rawText = result.response.text();

      // Parse structured JSON response
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
        // If not valid JSON, use raw text
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
      const errorMsg =
        error instanceof Error && error.message.includes("429")
          ? "VoteSmart is taking a quick breather. Please wait a moment!"
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
  }, [input, isLoading, messages, currentStep, language]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <>
      {/* FAB — Floating Action Button to open chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-saffron-500 hover:bg-saffron-600 text-navy-900 rounded-full shadow-lg shadow-saffron-500/25 flex items-center justify-center transition-all duration-300 hover:scale-105 focus-ring animate-fade-in"
          aria-label="Open AI chat assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <aside
          className="fixed bottom-0 right-0 z-50 w-full sm:w-[420px] h-[80vh] sm:h-[600px] sm:bottom-6 sm:right-6 bg-navy-900 border border-navy-700 sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up"
          role="complementary"
          aria-label="AI Chat Assistant"
        >
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b border-navy-700 bg-navy-800 sm:rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-india-green-500 animate-pulse-slow" />
              <h2 className="text-sm font-heading font-semibold text-ivory-50">
                VoteSmart AI
              </h2>
              <span className="text-[10px] bg-saffron-500/20 text-saffron-400 px-1.5 py-0.5 rounded-full">
                {currentStep}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-navy-700 text-ivory-300 hover:text-ivory-50 transition-colors focus-ring"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Messages — CRITICAL: aria-live="polite" for screen readers */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin"
            aria-live="polite"
            aria-relevant="additions"
            role="log"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-saffron-500 text-navy-900 rounded-br-md"
                      : "bg-navy-800 text-ivory-100 rounded-bl-md border border-navy-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Render checklist if AI returned one */}
                  {msg.checklist && msg.checklist.length > 0 && (
                    <ul className="mt-2 space-y-1.5" role="list">
                      {msg.checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <Check className="w-3.5 h-3.5 mt-0.5 text-india-green-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Render map if AI triggered show_map action */}
                  {msg.action === "show_map" && (
                    <div className="mt-3">
                      <MapEmbed className="rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-navy-800 border border-navy-700 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                  <Loader className="w-4 h-4 text-saffron-400" />
                  <span className="text-xs text-ivory-400">
                    VoteSmart is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <footer className="px-4 py-3 border-t border-navy-700 bg-navy-800 sm:rounded-b-2xl">
            <div className="flex items-center gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Type your question about the election process
              </label>
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the election process..."
                disabled={isLoading}
                className="flex-1 bg-navy-900 border border-navy-600 rounded-xl px-4 py-2.5 text-sm text-ivory-50 placeholder:text-ivory-500 focus-ring disabled:opacity-50 transition-colors"
                autoComplete="off"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-saffron-500 hover:bg-saffron-600 disabled:bg-navy-700 disabled:text-ivory-500 text-navy-900 rounded-xl flex items-center justify-center transition-all focus-ring disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-ivory-500 mt-1.5 text-center">
              Powered by Gemini AI · Context: {currentStep}
            </p>
          </footer>
        </aside>
      )}
    </>
  );
}
