"use client";

import { useState, useCallback } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useUser } from "@/context/UserContext";
import { getFirebaseAuth } from "@/lib/firebaseClient";

/**
 * LoginOverlay Component
 *
 * Provides a modal for users to either sign in with Google or continue as a guest.
 * Prevents access to the dashboard until authentication is complete.
 *
 * @returns React node representing the login overlay.
 */
export default function LoginOverlay() {
  const { login } = useUser();
  const [name, setName] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleGuest = () => {
    login(name.trim() || "Voter", "guest");
  };

  const handleGoogleSignIn = useCallback(async () => {
    setGoogleError("");
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(getFirebaseAuth(), provider);
      const displayName =
        result.user.displayName ||
        result.user.email?.split("@")[0] ||
        name.trim() ||
        "Voter";

      login(displayName, "google");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again.";
      setGoogleError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [login, name]);

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md w-full animate-slide-up shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-500 via-ivory-50 to-india-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-navy-900 font-heading font-bold text-xl">V</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-ivory-50">
            Welcome to VoteSmart
          </h2>
          <p className="text-sm text-ivory-400 mt-1">
            Your interactive election education journey
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="login-name"
              className="text-xs text-ivory-400 block mb-1"
            >
              Your Name
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuest()}
              placeholder="Enter your name"
              className="w-full bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-ivory-50 text-sm placeholder:text-ivory-500 focus-ring"
              autoFocus
            />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 bg-white text-slate-800 rounded-xl font-semibold text-sm border border-slate-200 hover:bg-slate-100 transition-colors focus-ring disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
          </button>

          <button
            onClick={handleGuest}
            className="w-full py-3 bg-saffron-500 hover:bg-saffron-600 text-navy-900 rounded-xl font-semibold text-sm transition-colors focus-ring"
          >
            🚀 Quick Start (Guest)
          </button>
          {googleError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {googleError}
            </p>
          )}
        </div>

        <p className="text-[10px] text-ivory-600 text-center mt-4">
          Your progress is saved locally in your browser
        </p>
      </div>
    </div>
  );
}
