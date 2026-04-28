"use client";

// =============================================================================
// context/UserContext.tsx — Voter RPG Profile & Progression System
// =============================================================================
// Persists to localStorage so progress survives browser refreshes.
// No database needed — hackathon-friendly, zero infrastructure cost.
// =============================================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/** Badge definitions */
export const BADGE_DEFINITIONS: Record<string, { name: string; icon: string; desc: string }> = {
  "registered-voter": { name: "Registered Voter", icon: "📋", desc: "Completed the Registration step" },
  "informed-citizen": { name: "Informed Citizen", icon: "🔍", desc: "Completed Candidate Research" },
  "virtual-voter": { name: "Virtual Voter", icon: "🗳️", desc: "Completed the EVM Simulator" },
  "quiz-ace": { name: "Quiz Ace", icon: "🏆", desc: "Scored 100% on any quiz" },
  "polyglot": { name: "Polyglot Voter", icon: "🌐", desc: "Used a non-English language" },
  "democracy-champion": { name: "Democracy Champion", icon: "⭐", desc: "Earned 500+ EXP" },
};

/** Calculate level from EXP (100 EXP per level) */
export function getLevel(exp: number): number {
  return Math.floor(exp / 100) + 1;
}

/** EXP needed for current level progress bar */
export function getLevelProgress(exp: number): number {
  return exp % 100;
}

interface UserState {
  name: string;
  loginType: "guest" | "google";
  exp: number;
  badges: string[];
  hasDigitalMark: boolean;
}

interface UserContextValue {
  user: UserState | null;
  isLoggedIn: boolean;
  login: (name: string, type: "guest" | "google") => void;
  logout: () => void;
  addExp: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
  setDigitalMark: (value: boolean) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const STORAGE_KEY = "votesmart_user";

function loadUser(): UserState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserState;
  } catch {
    return null;
  }
}

function saveUser(user: UserState | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (avoid SSR mismatch)
  useEffect(() => {
    setUser(loadUser());
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (hydrated) saveUser(user);
  }, [user, hydrated]);

  const login = useCallback((name: string, type: "guest" | "google") => {
    setUser({ name, loginType: type, exp: 0, badges: [], hasDigitalMark: false });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const addExp = useCallback((amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newExp = prev.exp + amount;
      const updated = { ...prev, exp: newExp };
      // Auto-award Democracy Champion at 500 EXP
      if (newExp >= 500 && !prev.badges.includes("democracy-champion")) {
        updated.badges = [...prev.badges, "democracy-champion"];
      }
      return updated;
    });
  }, []);

  const awardBadge = useCallback((badgeId: string) => {
    setUser((prev) => {
      if (!prev || prev.badges.includes(badgeId)) return prev;
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  }, []);

  const setDigitalMark = useCallback((value: boolean) => {
    setUser((prev) => (prev ? { ...prev, hasDigitalMark: value } : prev));
  }, []);

  // Don't render children until hydrated (prevents flash of login screen)
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{ user, isLoggedIn: !!user, login, logout, addExp, awardBadge, setDigitalMark }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
