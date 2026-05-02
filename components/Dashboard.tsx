"use client";

import { useState, useCallback } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useUser } from "@/context/UserContext";
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

import LoginOverlay from "./LoginOverlay";

/**
 * Dashboard Component
 *
 * The main application view. Manages the active election step, user progression,
 * language preferences, and renders the timeline and interactive modules.
 *
 * @returns React node representing the main dashboard.
 */
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
