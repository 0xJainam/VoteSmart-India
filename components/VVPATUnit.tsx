"use client";

import { Check } from "./Icons";
import { EVM_VVPAT_DURATION_S, EVM_EXP_REWARD } from "@/lib/constants";
import type { SimState } from "@/hooks/useEVM";
import type { Candidate } from "@/lib/types";

interface VVPATUnitProps {
  state: SimState;
  vvpatTimer: number;
  selectedCandidate?: Candidate;
  onReset: () => void;
}

export default function VVPATUnit({ state, vvpatTimer, selectedCandidate, onReset }: VVPATUnitProps) {
  return (
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
                  style={{ width: `${(vvpatTimer / EVM_VVPAT_DURATION_S) * 100}%` }}
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
            <p className="text-xs text-ivory-400 mt-1">+{EVM_EXP_REWARD} EXP earned</p>
            <p className="text-xs text-saffron-400">🏅 Virtual Voter badge unlocked!</p>
            <button
              onClick={onReset}
              className="mt-3 text-xs text-ivory-300 hover:text-saffron-400 underline focus-ring rounded"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
