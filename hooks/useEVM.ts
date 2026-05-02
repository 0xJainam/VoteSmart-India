import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { CANDIDATES, EVM_VVPAT_TIMEOUT_MS, EVM_VVPAT_DURATION_S, EVM_EXP_REWARD, EVM_VVPAT_COUNTDOWN_INTERVAL_MS } from "@/lib/constants";
import type { Candidate } from "@/lib/types";

export type SimState = "ready" | "pressed" | "vvpat" | "done";

export interface UseEVMProps {
  onComplete?: () => void;
}

export function useEVM({ onComplete }: UseEVMProps = {}) {
  const { addExp, awardBadge, setDigitalMark } = useUser();
  const [state, setState] = useState<SimState>("ready");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [vvpatTimer, setVvpatTimer] = useState(EVM_VVPAT_DURATION_S);

  const handleVote = useCallback((candidateId: number) => {
    if (state !== "ready") return;
    setSelectedId(candidateId);
    setState("pressed");

    // Simulate red light + beep, then show VVPAT
    setTimeout(() => setState("vvpat"), EVM_VVPAT_TIMEOUT_MS);
  }, [state]);

  // VVPAT countdown timer
  useEffect(() => {
    if (state !== "vvpat") return;
    setVvpatTimer(EVM_VVPAT_DURATION_S);
    const interval = setInterval(() => {
      setVvpatTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setState("done");
          addExp(EVM_EXP_REWARD);
          awardBadge("virtual-voter");
          setDigitalMark(true);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, EVM_VVPAT_COUNTDOWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [state, addExp, awardBadge, setDigitalMark, onComplete]);

  const selectedCandidate: Candidate | undefined = CANDIDATES.find((c) => c.id === selectedId);

  const resetSimulator = useCallback(() => {
    setState("ready");
    setSelectedId(null);
    setVvpatTimer(EVM_VVPAT_DURATION_S);
  }, []);

  return {
    state,
    selectedId,
    vvpatTimer,
    handleVote,
    resetSimulator,
    selectedCandidate,
  };
}
