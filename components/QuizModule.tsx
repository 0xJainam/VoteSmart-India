"use client";

// =============================================================================
// components/QuizModule.tsx — Rapid-fire quiz per election step
// =============================================================================
// Loads questions from QUIZ_QUESTIONS constant based on current step.
// Awards EXP per correct answer + "Quiz Ace" badge for perfect score.
// =============================================================================

import { useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { QUIZ_QUESTIONS, UI_LABELS } from "@/lib/constants";
import { Check, X } from "./Icons";
import type { ElectionStepId, SupportedLanguage, TranslatedText } from "@/lib/types";

interface QuizModuleProps {
  stepId: ElectionStepId;
  language: SupportedLanguage;
  onComplete?: () => void;
}

function t(text: TranslatedText, lang: SupportedLanguage): string {
  return text[lang] || text.en;
}

export default function QuizModule({ stepId, language, onComplete }: QuizModuleProps) {
  const { addExp, awardBadge } = useUser();
  const questions = QUIZ_QUESTIONS[stepId] ?? [];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];
  if (!question) return null;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (selected !== null) return; // Already answered
      setSelected(optionIndex);
      const isCorrect = optionIndex === question.correctIndex;
      if (isCorrect) {
        setScore((s) => s + 1);
        addExp(25);
      }
      setShowResult(true);
    },
    [selected, question, addExp]
  );

  const handleNext = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      // Perfect score badge
      if (score + (selected === question.correctIndex ? 0 : 0) === questions.length) {
        // Score already includes current correct answer
      }
      const finalScore = score;
      if (finalScore === questions.length) {
        awardBadge("quiz-ace");
        addExp(50); // Bonus for perfect
      }
      onComplete?.();
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelected(null);
    setShowResult(false);
  }, [currentQ, questions.length, score, selected, question, awardBadge, addExp, onComplete]);

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 text-center animate-fade-in">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
          percentage >= 80 ? "bg-india-green-500" : percentage >= 50 ? "bg-saffron-500" : "bg-red-500"
        }`}>
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
        <h4 className="text-lg font-heading font-bold text-ivory-50 mb-1">
          {percentage >= 80 ? t(UI_LABELS.quiz_excellent, language) : percentage >= 50 ? t(UI_LABELS.quiz_good, language) : t(UI_LABELS.quiz_keep_learning, language)}
        </h4>
        <p className="text-sm text-ivory-300 mb-1">
          You scored {score}/{questions.length}
        </p>
        <p className="text-xs text-saffron-400 mb-4">
          +{score * 25} EXP earned{score === questions.length ? " + 50 bonus!" : ""}
        </p>
        <button
          onClick={resetQuiz}
          className="px-4 py-2 bg-saffron-500/10 text-saffron-400 hover:bg-saffron-500/20 rounded-lg text-sm font-medium transition-colors focus-ring"
        >
          {t(UI_LABELS.try_again, language)}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-ivory-400">
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="text-xs text-india-green-400">Score: {score}</span>
      </div>
      <div className="w-full bg-navy-700 rounded-full h-1 mb-5">
        <div
          className="bg-saffron-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h4 className="text-sm sm:text-base font-medium text-ivory-50 mb-4 leading-relaxed">
        {t(question.question, language)}
      </h4>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = i === selected;
          let btnClass = "border-navy-600 bg-navy-800 hover:bg-navy-700 hover:border-navy-500 text-ivory-200";

          if (showResult) {
            if (isCorrect) {
              btnClass = "border-india-green-500 bg-india-green-500/10 text-india-green-300";
            } else if (isSelected && !isCorrect) {
              btnClass = "border-red-500 bg-red-500/10 text-red-300";
            } else {
              btnClass = "border-navy-700 bg-navy-900 text-ivory-500";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus-ring flex items-center gap-3 ${btnClass} ${
                !showResult ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                showResult && isCorrect
                  ? "border-india-green-500 bg-india-green-500 text-white"
                  : showResult && isSelected && !isCorrect
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-current"
              }`}>
                {showResult && isCorrect ? (
                  <Check className="w-3 h-3" />
                ) : showResult && isSelected && !isCorrect ? (
                  <X className="w-3 h-3" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span>{t(option, language)}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {showResult && (
        <div className="animate-fade-in">
          <div className="bg-navy-900/50 border border-navy-700 rounded-lg p-3 mb-4">
            <p className="text-xs text-ivory-300 leading-relaxed">
              <strong className="text-saffron-400">Explanation: </strong>
              {t(question.explanation, language)}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-2.5 bg-saffron-500 hover:bg-saffron-600 text-navy-900 rounded-xl text-sm font-semibold transition-colors focus-ring"
          >
            {currentQ + 1 >= questions.length ? "See Results" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}
