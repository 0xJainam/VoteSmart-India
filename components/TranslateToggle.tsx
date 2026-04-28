"use client";

// =============================================================================
// components/TranslateToggle.tsx — Language selector with translation caching
// =============================================================================

import { useCallback } from "react";
import { Globe } from "./Icons";
import { LANGUAGE_LABELS } from "@/lib/types";
import type { SupportedLanguage } from "@/lib/types";

interface TranslateToggleProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const LANGUAGES = Object.entries(LANGUAGE_LABELS) as [SupportedLanguage, string][];

export default function TranslateToggle({
  currentLang,
  onLanguageChange,
}: TranslateToggleProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onLanguageChange(e.target.value as SupportedLanguage);
    },
    [onLanguageChange]
  );

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-6 h-6 text-saffron-400" />
      <label htmlFor="language-select" className="sr-only">
        Select language
      </label>
      <select
        id="language-select"
        value={currentLang}
        onChange={handleChange}
        className="bg-navy-800 text-ivory-50 text-sm rounded-lg border border-navy-600 px-2 py-1.5 focus-ring cursor-pointer hover:border-saffron-500 transition-colors"
        aria-label="Select language"
      >
        {LANGUAGES.map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
