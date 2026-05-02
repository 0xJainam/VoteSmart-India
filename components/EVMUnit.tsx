"use client";

import { CANDIDATES } from "@/lib/constants";
import type { SimState } from "@/hooks/useEVM";

interface EVMUnitProps {
  state: SimState;
  selectedId: number | null;
  onVote: (id: number) => void;
}

export default function EVMUnit({ state, selectedId, onVote }: EVMUnitProps) {
  return (
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
              onClick={() => onVote(candidate.id)}
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
  );
}
