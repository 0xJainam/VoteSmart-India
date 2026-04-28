"use client";

// =============================================================================
// components/Header.tsx — Progression Dashboard with Digital Mark
// =============================================================================
// Shows user level, EXP progress bar, badge gallery, and the digital ink mark
// on the avatar after completing the EVM simulator.
// =============================================================================

import { useUser, getLevel, getLevelProgress, BADGE_DEFINITIONS } from "@/context/UserContext";
import TranslateToggle from "./TranslateToggle";
import type { SupportedLanguage } from "@/lib/types";

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const { user, logout } = useUser();
  const level = user ? getLevel(user.exp) : 1;
  const progress = user ? getLevelProgress(user.exp) : 0;

  return (
    <header className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-lg border-b border-navy-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top row: Logo + Language + User */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron-500 via-ivory-50 to-india-green-500 flex items-center justify-center shadow-md">
              <span className="text-navy-900 font-heading font-bold text-sm">V</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-heading font-bold text-ivory-50 leading-none">
                VoteSmart India
              </h1>
              <p className="text-[10px] text-ivory-400 leading-none mt-0.5">
                Interactive Election Guide
              </p>
            </div>
          </div>

          {/* Center: User Progression (only when logged in) */}
          {user && (
            <div className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-md">
              {/* Avatar with Digital Mark */}
              <div className="relative flex-shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-heading font-bold text-base ${
                  user.hasDigitalMark
                    ? "bg-gradient-to-br from-purple-600 to-purple-800 text-ivory-50 ring-2 ring-purple-400/50"
                    : "bg-navy-700 text-ivory-200"
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {/* Digital ink mark indicator */}
                {user.hasDigitalMark && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-navy-900 flex items-center justify-center" title="Digital ink mark — you voted!">
                    <span className="text-[7px]">✓</span>
                  </div>
                )}
              </div>

              {/* Level + EXP bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-ivory-300">
                    {user.name} · Lv.{level}
                  </span>
                  <span className="text-xs text-saffron-400 font-mono">
                    {user.exp} EXP
                  </span>
                </div>
                <div className="w-full bg-navy-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-saffron-500 to-saffron-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Badge gallery (compact) */}
              {user.badges.length > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  {user.badges.slice(0, 4).map((badgeId) => {
                    const badge = BADGE_DEFINITIONS[badgeId];
                    return badge ? (
                      <div
                        key={badgeId}
                        className="w-7 h-7 rounded-full bg-navy-800 border border-navy-600 flex items-center justify-center text-sm hover:scale-110 transition-transform cursor-default"
                        title={`${badge.name}: ${badge.desc}`}
                      >
                        {badge.icon}
                      </div>
                    ) : null;
                  })}
                  {user.badges.length > 4 && (
                    <span className="text-[10px] text-ivory-500">+{user.badges.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right: Language + logout */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <TranslateToggle currentLang={language} onLanguageChange={onLanguageChange} />
            {user && (
              <button
                onClick={logout}
                className="text-sm text-ivory-500 hover:text-ivory-300 transition-colors focus-ring rounded px-3 py-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile progression bar (below header on small screens) */}
        {user && (
          <div className="md:hidden flex items-center gap-3 mt-2 pt-2 border-t border-navy-800">
            <div className="relative flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                user.hasDigitalMark
                  ? "bg-gradient-to-br from-purple-600 to-purple-800 text-ivory-50 ring-2 ring-purple-400/50"
                  : "bg-navy-700 text-ivory-200"
              }`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              {user.hasDigitalMark && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-navy-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-ivory-300">Lv.{level}</span>
                <span className="text-[10px] text-saffron-400">{user.exp} EXP</span>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-1">
                <div
                  className="bg-saffron-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex gap-0.5">
              {user.badges.slice(0, 3).map((id) => {
                const b = BADGE_DEFINITIONS[id];
                return b ? <span key={id} className="text-sm" title={b.name}>{b.icon}</span> : null;
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
