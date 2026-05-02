"use client";

// =============================================================================
// components/ChatPanel.tsx — AI Chat Interface (Client-side Gemini SDK)
// =============================================================================

import { useRef, useEffect } from "react";
import { Send, MessageCircle, X, Loader, Check } from "./Icons";
import MapEmbed from "./MapEmbed";
import { useChat } from "@/hooks/useChat";
import type { ElectionStepId, SupportedLanguage } from "@/lib/types";

interface ChatPanelProps {
  currentStep: ElectionStepId;
  language: SupportedLanguage;
}

/**
 * ChatPanel Component
 *
 * An interactive AI assistant interface powered by Google Gemini.
 * It provides context-aware guidance based on the active election step
 * and enforces local rate-limiting and error handling.
 *
 * @param props - Component properties.
 * @param props.currentStep - The current active election step ID to provide context to the AI.
 * @param props.language - The user's preferred language.
 * @returns React node representing the chat interface.
 */
export default function ChatPanel({ currentStep, language }: ChatPanelProps) {
  const {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    cooldown,
    sendMessage,
  } = useChat({ currentStep, language });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
                disabled={isLoading || cooldown}
                className="flex-1 bg-navy-900 border border-navy-600 rounded-xl px-4 py-2.5 text-sm text-ivory-50 placeholder:text-ivory-500 focus-ring disabled:opacity-50 transition-colors"
                autoComplete="off"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || cooldown || !input.trim()}
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
