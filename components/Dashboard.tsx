"use client";

import { useState, useCallback } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useUser } from "@/context/UserContext";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import Header from "./Header";
import Timeline from "./Timeline";
import ChatPanel from "./ChatPanel";
import MapEmbed from "./MapEmbed";
import EVMSimulator from "./EVMSimulator";
import QuizModule from "./QuizModule";
import { ELECTION_TIMELINE, ELECTION_RULES, UI_LABELS } from "@/lib/constants";
import { Check, ChevronRight } from "./Icons";
import type {
  ElectionStepId,
  SupportedLanguage,
  TranslatedText,
} from "@/lib/types";

function t(text: TranslatedText, lang: SupportedLanguage): string {
  return text[lang] || text.en;
}

/** Login overlay for unauthenticated users */
function LoginOverlay() {
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
            <span className="text-navy-900 font-heading font-bold text-xl">
              V
            </span>
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

export default function Dashboard() {
  const { user, isLoggedIn, awardBadge, addExp } = useUser();
  const [activeStep, setActiveStep] = useState<ElectionStepId>("registration");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [showEVM, setShowEVM] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const currentStepData = ELECTION_TIMELINE.find((s) => s.id === activeStep);
  const currentIndex = ELECTION_TIMELINE.findIndex((s) => s.id === activeStep);
  const nextStep = ELECTION_TIMELINE[currentIndex + 1];
  const prevStep = ELECTION_TIMELINE[currentIndex - 1];

  const handleStepChange = useCallback(
    (stepId: ElectionStepId) => {
      setActiveStep(stepId);
      setShowEVM(false);
      setShowQuiz(false);
      // Award step badges
      if (stepId === "research") awardBadge("registered-voter");
      if (stepId === "counting") awardBadge("informed-citizen");
    },
    [awardBadge],
  );

  const handleLanguageChange = useCallback(
    (lang: SupportedLanguage) => {
      setLanguage(lang);
      if (lang !== "en") awardBadge("polyglot");
    },
    [awardBadge],
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Login Overlay */}
      {!isLoggedIn && <LoginOverlay />}

      {/* Header with progression */}
      <Header language={language} onLanguageChange={handleLanguageChange} />

      {/* Hero */}
      <section className="gradient-hero py-8 sm:py-10 px-4 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <div className="absolute top-10 left-10 w-32 h-32 border border-saffron-500 rounded-full" />
          <div className="absolute top-20 right-20 w-24 h-24 border border-india-green-500 rounded-full" />
          <div className="absolute bottom-10 left-1/3 w-16 h-16 border border-ivory-50 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center mb-6 relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-ivory-50 mb-2">
            {language === "en"
              ? "Your Vote, Your Voice"
              : language === "hi"
                ? "आपका वोट, आपकी आवाज़"
                : language === "bn"
                  ? "আপনার ভোট, আপনার কণ্ঠ"
                  : language === "mr"
                    ? "तुमचे मत, तुमचा आवाज"
                    : "మీ ఓటు, మీ గొంతు"}
          </h2>
          <p className="text-ivory-300 text-sm max-w-xl mx-auto">
            {t(UI_LABELS.hero_subtitle, language)}
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Timeline
            activeStep={activeStep}
            onStepChange={handleStepChange}
            language={language}
          />
        </div>
      </section>

      {/* Main Content */}
      <main id="main-content" className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentStepData && (
            <article
              className="animate-fade-in"
              role="tabpanel"
              id={`panel-${currentStepData.id}`}
              aria-labelledby={`tab-${currentStepData.id}`}
            >
              {/* Step Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-saffron-500 text-navy-900 flex items-center justify-center font-heading font-bold text-lg">
                  {currentStepData.order}
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-ivory-50">
                    {t(currentStepData.title, language)}
                  </h3>
                  <p className="text-xs text-ivory-400">
                    {t(UI_LABELS.step_of, language)} {currentStepData.order} of{" "}
                    {ELECTION_TIMELINE.length}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 mb-6">
                <p className="text-ivory-200 leading-relaxed text-sm sm:text-base">
                  {t(currentStepData.description, language)}
                </p>
              </div>

              {/* Checklist */}
              <div className="bg-navy-800/30 border border-navy-700/50 rounded-2xl p-6 mb-6">
                <h4 className="text-sm font-heading font-semibold text-saffron-400 mb-4 uppercase tracking-wide">
                  {t(UI_LABELS.action_checklist, language)}
                </h4>
                <ul className="space-y-3" role="list">
                  {currentStepData.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="w-5 h-5 rounded-full border-2 border-india-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-india-green-500 transition-colors">
                        <Check className="w-3 h-3 text-india-green-500 group-hover:text-ivory-50 transition-colors" />
                      </div>
                      <span className="text-ivory-200 text-sm">
                        {t(item, language)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Election Rules (on Polling step) */}
              {activeStep === "polling" && (
                <div className="bg-navy-800/30 border border-navy-700/50 rounded-2xl p-6 mb-6">
                  <h4 className="text-sm font-heading font-semibold text-saffron-400 mb-4 uppercase tracking-wide">
                    {t(UI_LABELS.polling_day_rules, language)}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ELECTION_RULES.map((rule, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 text-sm p-2 rounded-lg ${rule.type === "do" ? "bg-india-green-500/5" : "bg-red-500/5"}`}
                      >
                        <span>{rule.icon}</span>
                        <span
                          className={
                            rule.type === "do"
                              ? "text-ivory-200"
                              : "text-ivory-300"
                          }
                        >
                          {t(rule.rule, language)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map Embed (Polling step) */}
              {currentStepData.showMap && (
                <div className="mb-6">
                  <h4 className="text-sm font-heading font-semibold text-saffron-400 mb-3 uppercase tracking-wide">
                    {t(UI_LABELS.find_polling_station, language)}
                  </h4>
                  <MapEmbed
                    className="border border-navy-700 rounded-2xl"
                    language={language}
                  />
                </div>
              )}

              {/* Interactive Modules — EVM Simulator & Quiz */}
              <div className="flex flex-wrap gap-3 mb-6">
                {activeStep === "polling" && (
                  <button
                    onClick={() => {
                      setShowEVM(!showEVM);
                      setShowQuiz(false);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus-ring ${showEVM ? "bg-saffron-500 text-navy-900" : "bg-saffron-500/10 text-saffron-400 hover:bg-saffron-500/20"}`}
                  >
                    🗳️{" "}
                    {showEVM
                      ? t(UI_LABELS.hide_evm_simulator, language)
                      : t(UI_LABELS.try_evm_simulator, language)}
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowQuiz(!showQuiz);
                    setShowEVM(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus-ring ${showQuiz ? "bg-india-green-500 text-ivory-50" : "bg-india-green-500/10 text-india-green-400 hover:bg-india-green-500/20"}`}
                >
                  📝{" "}
                  {showQuiz
                    ? t(UI_LABELS.hide_quiz, language)
                    : t(UI_LABELS.take_quiz, language)}
                </button>
              </div>

              {/* EVM Simulator */}
              {showEVM && activeStep === "polling" && (
                <div className="mb-6 animate-slide-up">
                  <EVMSimulator language={language} />
                </div>
              )}

              {/* Quiz Module */}
              {showQuiz && (
                <div className="mb-6 animate-slide-up">
                  <QuizModule
                    stepId={activeStep}
                    language={language}
                    onComplete={() => addExp(10)}
                  />
                </div>
              )}

              {/* Step Navigation */}
              <nav
                className="flex items-center justify-between pt-4 border-t border-navy-800"
                aria-label="Step navigation"
              >
                {prevStep ? (
                  <button
                    onClick={() => handleStepChange(prevStep.id)}
                    className="flex items-center gap-2 text-sm text-ivory-300 hover:text-saffron-400 transition-colors focus-ring rounded-lg px-3 py-2"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    {t(prevStep.title, language)}
                  </button>
                ) : (
                  <div />
                )}
                {nextStep && (
                  <button
                    onClick={() => handleStepChange(nextStep.id)}
                    className="flex items-center gap-2 text-sm bg-saffron-500/10 text-saffron-400 hover:bg-saffron-500/20 transition-colors focus-ring rounded-lg px-4 py-2 font-medium"
                  >
                    {t(nextStep.title, language)}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </nav>
            </article>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-800 py-6 px-4 text-center">
        <p className="text-[10px] text-ivory-600">
          Educational tool only. Visit{" "}
          <a
            href="https://eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron-500 hover:underline focus-ring rounded"
          >
            eci.gov.in
          </a>{" "}
          for official information.
        </p>
      </footer>

      {/* Chat */}
      <ChatPanel currentStep={activeStep} language={language} />
    </div>
  );
}
