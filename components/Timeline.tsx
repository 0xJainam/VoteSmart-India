"use client";

// =============================================================================
// components/Timeline.tsx — Interactive election phase stepper
// =============================================================================
// Fully keyboard navigable: ArrowRight/ArrowLeft to move, Enter/Space to select.
// Uses aria-current="step" for the active step (screen reader support).
// =============================================================================

import { useCallback } from "react";
import { ELECTION_TIMELINE } from "@/lib/constants";
import { ICON_MAP, Check } from "./Icons";
import type { ElectionStepId, SupportedLanguage, TranslatedText } from "@/lib/types";

interface TimelineProps {
  activeStep: ElectionStepId;
  onStepChange: (stepId: ElectionStepId) => void;
  language: SupportedLanguage;
}

/** Helper to get localised text from a TranslatedText object */
function t(text: TranslatedText, lang: SupportedLanguage): string {
  return text[lang] || text.en;
}

export default function Timeline({
  activeStep,
  onStepChange,
  language,
}: TimelineProps) {
  const activeIndex = ELECTION_TIMELINE.findIndex((s) => s.id === activeStep);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const steps = ELECTION_TIMELINE;
      let newIndex = activeIndex;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        newIndex = Math.min(activeIndex + 1, steps.length - 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        newIndex = Math.max(activeIndex - 1, 0);
      } else if (e.key === "Home") {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        newIndex = steps.length - 1;
      }

      if (newIndex !== activeIndex) {
        onStepChange(steps[newIndex].id);
      }
    },
    [activeIndex, onStepChange]
  );

  return (
    <nav aria-label="Election process timeline" className="w-full">
      {/* Desktop: horizontal stepper */}
      <ol
        className="hidden md:flex items-start justify-between gap-0"
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        {ELECTION_TIMELINE.map((step, index) => {
          const isActive = step.id === activeStep;
          const isPast = index < activeIndex;
          const IconComponent = ICON_MAP[step.icon];

          return (
            <li
              key={step.id}
              className="flex-1 flex flex-col items-center relative"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "step" : undefined}
              tabIndex={isActive ? 0 : -1}
              id={`tab-${step.id}`}
              aria-controls={`panel-${step.id}`}
            >
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={`absolute top-6 right-1/2 w-full h-0.5 -translate-y-1/2 transition-colors duration-300 ${
                    isPast ? "bg-india-green-500" : "bg-navy-700"
                  }`}
                  aria-hidden="true"
                />
              )}

              <button
                onClick={() => onStepChange(step.id)}
                className={`relative z-10 flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 focus-ring group ${
                  isActive
                    ? "bg-saffron-500/10 ring-1 ring-saffron-500/30"
                    : "hover:bg-navy-800/50"
                }`}
                aria-label={`Step ${step.order}: ${t(step.title, language)}`}
              >
                {/* Step circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-saffron-500 text-navy-900 shadow-lg shadow-saffron-500/25"
                      : isPast
                      ? "bg-india-green-500 text-ivory-50"
                      : "bg-navy-700 text-ivory-200 group-hover:bg-navy-600"
                  }`}
                >
                  {isPast ? (
                    <Check className="w-5 h-5" />
                  ) : IconComponent ? (
                    <IconComponent className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{step.order}</span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`text-xs font-medium text-center max-w-[100px] leading-tight transition-colors ${
                    isActive
                      ? "text-saffron-400 font-semibold"
                      : isPast
                      ? "text-india-green-400"
                      : "text-ivory-300"
                  }`}
                >
                  {t(step.title, language)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical stepper */}
      <ol
        className="flex md:hidden flex-col gap-1"
        role="tablist"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
      >
        {ELECTION_TIMELINE.map((step, index) => {
          const isActive = step.id === activeStep;
          const isPast = index < activeIndex;
          const IconComponent = ICON_MAP[step.icon];

          return (
            <li
              key={step.id}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "step" : undefined}
              tabIndex={isActive ? 0 : -1}
              id={`tab-${step.id}`}
              aria-controls={`panel-${step.id}`}
            >
              <button
                onClick={() => onStepChange(step.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 focus-ring ${
                  isActive
                    ? "bg-saffron-500/10 border border-saffron-500/30"
                    : "hover:bg-navy-800/50 border border-transparent"
                }`}
                aria-label={`Step ${step.order}: ${t(step.title, language)}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isActive
                      ? "bg-saffron-500 text-navy-900"
                      : isPast
                      ? "bg-india-green-500 text-ivory-50"
                      : "bg-navy-700 text-ivory-200"
                  }`}
                >
                  {isPast ? (
                    <Check className="w-4 h-4" />
                  ) : IconComponent ? (
                    <IconComponent className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{step.order}</span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isActive
                      ? "text-saffron-400 font-semibold"
                      : isPast
                      ? "text-india-green-400"
                      : "text-ivory-300"
                  }`}
                >
                  {t(step.title, language)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
