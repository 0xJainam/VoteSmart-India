"use client";

import { useEVM } from "@/hooks/useEVM";
import EVMUnit from "./EVMUnit";
import VVPATUnit from "./VVPATUnit";
import { UI_LABELS } from "@/lib/constants";
import type { SupportedLanguage, TranslatedText } from "@/lib/types";

interface EVMSimulatorProps {
  onComplete?: () => void;
  language?: SupportedLanguage;
}

/**
 * Helper to get the translated string based on language.
 *
 * @param text - The TranslatedText object.
 * @param lang - The currently selected language.
 * @returns The translated string, falling back to English.
 */
function t(text: TranslatedText, lang: SupportedLanguage): string {
  return text[lang] || text.en;
}

/**
 * EVMSimulator Component
 *
 * Provides a mock Electronic Voting Machine (EVM) for educational purposes.
 * Users can simulate pressing a candidate button and verifying their vote via VVPAT.
 *
 * @param props - Component properties.
 * @param props.onComplete - Optional callback invoked when voting is successful.
 * @param props.language - The currently selected UI language.
 * @returns React node representing the EVM simulator.
 */
export default function EVMSimulator({ onComplete, language = "en" }: EVMSimulatorProps) {
  const { state, selectedId, vvpatTimer, handleVote, resetSimulator, selectedCandidate } = useEVM({ onComplete });

  return (
    <div className="max-w-2xl mx-auto" role="region" aria-label="EVM Simulator — Practice voting experience">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-heading font-bold text-ivory-50">
          {t(UI_LABELS.evm_simulator_title, language)}
        </h3>
        <p className="text-xs text-ivory-400 mt-1">
          {t(UI_LABELS.evm_simulator_subtitle, language)}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* ============ EVM UNIT (Left) ============ */}
        <EVMUnit state={state} selectedId={selectedId} onVote={handleVote} />

        {/* ============ VVPAT UNIT (Right) ============ */}
        <VVPATUnit state={state} vvpatTimer={vvpatTimer} selectedCandidate={selectedCandidate} onReset={resetSimulator} />
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-navy-800/30 border border-navy-700/50 rounded-xl p-4">
        <p className="text-xs text-ivory-400 leading-relaxed">
          <strong className="text-saffron-400">How real EVMs work:</strong> On polling day,
          you press the blue button next to your chosen candidate. A red light glows and a
          beep confirms your vote. The VVPAT machine then displays a paper slip for 7 seconds
          so you can verify your choice before it drops into a sealed box.
        </p>
      </div>
    </div>
  );
}
