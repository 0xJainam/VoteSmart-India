import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Check } from "./Icons";
import { UI_LABELS } from "@/lib/constants";
import type { SupportedLanguage, TranslatedText } from "@/lib/types";

/** Mock candidate data for the EVM */
const CANDIDATES = [
  { id: 1, name: "Candidate A", party: "National Progress Party", symbol: "🌻" },
  { id: 2, name: "Candidate B", party: "People's Democratic Front", symbol: "🔔" },
  { id: 3, name: "Candidate C", party: "United Citizens Alliance", symbol: "⭐" },
  { id: 4, name: "Candidate D", party: "Independent", symbol: "🏛️" },
  { id: 5, name: "NOTA", party: "None of the Above", symbol: "✖️" },
];

type SimState = "ready" | "pressed" | "vvpat" | "done";

interface EVMSimulatorProps {
  onComplete?: () => void;
  language?: SupportedLanguage;
}

function t(text: TranslatedText, lang: SupportedLanguage): string {
  return text[lang] || text.en;
}

export default function EVMSimulator({ onComplete, language = "en" }: EVMSimulatorProps) {
  const { addExp, awardBadge, setDigitalMark } = useUser();
  const [state, setState] = useState<SimState>("ready");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [vvpatTimer, setVvpatTimer] = useState(7);

  const handleVote = useCallback((candidateId: number) => {
    if (state !== "ready") return;
    setSelectedId(candidateId);
    setState("pressed");

    // Simulate red light + beep (300ms), then show VVPAT
    setTimeout(() => setState("vvpat"), 800);
  }, [state]);

  // VVPAT countdown timer
  useEffect(() => {
    if (state !== "vvpat") return;
    setVvpatTimer(7);
    const interval = setInterval(() => {
      setVvpatTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setState("done");
          addExp(100);
          awardBadge("virtual-voter");
          setDigitalMark(true);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state, addExp, awardBadge, setDigitalMark, onComplete]);

  const selectedCandidate = CANDIDATES.find((c) => c.id === selectedId);

  const resetSimulator = () => {
    setState("ready");
    setSelectedId(null);
    setVvpatTimer(7);
  };

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
        <div className="flex-1 bg-navy-800 border-2 border-navy-600 rounded-2xl p-1 shadow-xl">
          {/* EVM Header */}
          <div className="bg-gradient-to-r from-navy-700 to-navy-800 rounded-t-xl px-4 py-2 flex items-center justify-between">
            <span className="text-[10px] text-ivory-400 font-mono uppercase tracking-widest">
              Ballot Unit
            </span>
            <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              state === "pressed" ? "bg-red-500 shadow-lg shadow-red-500/50" : "bg-navy-600"
            }`} />
          </div>

          {/* Candidate Table */}
          <div className="divide-y divide-navy-700">
            {CANDIDATES.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center px-3 py-2.5 group"
              >
                {/* Serial Number */}
                <div className="w-8 text-center">
                  <span className="text-xs font-mono text-ivory-400">
                    {candidate.id}
                  </span>
                </div>

                {/* Candidate Info */}
                <div className="flex-1 px-3">
                  <p className="text-sm font-medium text-ivory-100">
                    {candidate.name}
                  </p>
                  <p className="text-[10px] text-ivory-500">
                    {candidate.party}
                  </p>
                </div>

                {/* Symbol */}
                <div className="w-10 text-center text-lg">{candidate.symbol}</div>

                {/* Vote Button (blue tactile) */}
                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={state !== "ready"}
                  className={`w-12 h-8 rounded-md border-2 text-xs font-bold transition-all duration-150 focus-ring ${
                    state !== "ready"
                      ? selectedId === candidate.id && state === "pressed"
                        ? "bg-red-600 border-red-500 text-white scale-95 shadow-inner"
                        : "bg-navy-700 border-navy-600 text-navy-500 cursor-not-allowed"
                      : "bg-blue-700 border-blue-500 text-white hover:bg-blue-600 active:scale-95 active:bg-blue-800 shadow-md hover:shadow-lg cursor-pointer"
                  }`}
                  aria-label={`Vote for ${candidate.name}`}
                >
                  {selectedId === candidate.id && state !== "ready" ? "✓" : "VOTE"}
                </button>
              </div>
            ))}
          </div>

          {/* EVM Footer */}
          <div className="bg-navy-700/50 rounded-b-xl px-4 py-2">
            <p className="text-[9px] text-ivory-500 text-center font-mono">
              ELECTION COMMISSION OF INDIA — TRAINING SIMULATOR
            </p>
          </div>
        </div>

        {/* ============ VVPAT UNIT (Right) ============ */}
        <div className="w-full lg:w-56 bg-navy-800 border-2 border-navy-600 rounded-2xl p-1 shadow-xl flex flex-col">
          <div className="bg-gradient-to-r from-navy-700 to-navy-800 rounded-t-xl px-4 py-2">
            <span className="text-[10px] text-ivory-400 font-mono uppercase tracking-widest">
              VVPAT Window
            </span>
          </div>

          {/* VVPAT Display Area */}
          <div className="flex-1 flex items-center justify-center p-4 min-h-[180px]">
            {state === "ready" && (
              <p className="text-xs text-ivory-500 text-center italic">
                Press a blue button on the EVM to cast your vote
              </p>
            )}

            {state === "pressed" && (
              <div className="text-center animate-pulse">
                <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-2 shadow-lg shadow-red-500/50" />
                <p className="text-xs text-red-400 font-mono">BEEP!</p>
              </div>
            )}

            {state === "vvpat" && selectedCandidate && (
              <div className="w-full animate-slide-up">
                {/* Paper Slip */}
                <div className="bg-ivory-50 text-navy-900 rounded-lg p-4 shadow-xl border border-ivory-300 relative overflow-hidden">
                  {/* Perforation dots */}
                  <div className="absolute top-0 left-0 right-0 flex justify-between px-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-navy-200" />
                    ))}
                  </div>

                  <div className="text-center mt-2">
                    <p className="text-2xl mb-1">{selectedCandidate.symbol}</p>
                    <p className="text-xs font-bold">{selectedCandidate.name}</p>
                    <p className="text-[10px] text-navy-600">{selectedCandidate.party}</p>
                    <div className="mt-2 border-t border-dashed border-navy-300 pt-2">
                      <p className="text-[9px] text-navy-500">Serial: ECI-SIM-2024</p>
                    </div>
                  </div>
                </div>

                {/* Timer */}
                <div className="mt-3 text-center">
                  <div className="w-full bg-navy-700 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-saffron-500 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(vvpatTimer / 7) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-ivory-400">
                    Slip visible for {vvpatTimer}s
                  </p>
                </div>
              </div>
            )}

            {state === "done" && (
              <div className="text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-india-green-500 mx-auto mb-3 flex items-center justify-center">
                  <Check className="w-6 h-6 text-ivory-50" />
                </div>
                <p className="text-sm font-heading font-bold text-india-green-400">
                  Vote Recorded!
                </p>
                <p className="text-xs text-ivory-400 mt-1">+100 EXP earned</p>
                <p className="text-xs text-saffron-400">🏅 Virtual Voter badge unlocked!</p>
                <button
                  onClick={resetSimulator}
                  className="mt-3 text-xs text-ivory-300 hover:text-saffron-400 underline focus-ring rounded"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
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
