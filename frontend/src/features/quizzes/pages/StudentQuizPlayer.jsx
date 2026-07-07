import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Timer, ChevronLeft, ChevronRight, CheckCircle2, Flag } from "lucide-react";
import quizService from "../services/quizService";

import { Progress } from "@/shared/components/ui/progress";

export default function StudentQuizPlayer() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const studentId = "s4";
  const studentName = "Jane Doe";

  const [quiz, setQuiz] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      quizService.getQuizById(quizId),
      quizService.getQuizQuestionsForStudent(quizId)
    ]).then(([quizData, questionsData]) => {
      if (quizData) {
        setQuiz({
          ...quizData,
          questions: questionsData
        });
        setTimeLeft((quizData.duration || 20) * 60);
      }
    }).catch(err => {
      console.error("Failed to load quiz details", err);
    });
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (optionLetter) => {
    setAnswers(prev => ({ ...prev, [activeIdx]: optionLetter }));
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [activeIdx]: !prev[activeIdx] }));
  };

  const handleNext = () => {
    if (activeIdx < quiz.questions.length - 1) setActiveIdx(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeIdx > 0) setActiveIdx(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting || !quiz) return;
    setIsSubmitting(true);

    const questions = quiz.questions;
    const submissionAnswers = questions.map((q, idx) => ({
      question: q.question,
      studentAnswer: answers[idx] || ""
    }));

    const payload = {
      studentId,
      studentName,
      timeTaken: `${Math.round(((quiz.duration * 60) - timeLeft) / 60) || 1} mins`,
      answers: submissionAnswers
    };

    try {
      await quizService.submitQuiz(quizId, payload);
      navigate(`/student/quizzes/${quizId}/result`);
    } catch (e) {
      console.error("Failed to submit quiz result", e);
      setIsSubmitting(false);
    }
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center p-12 min-h-screen bg-surface">
        <div className="text-on-surface-variant text-sm">Loading Quiz Player...</div>
      </div>
    );
  }

  const q = quiz.questions[activeIdx];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((activeIdx + 1) / quiz.questions.length) * 100);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen w-full bg-surface text-on-surface flex flex-col" style={{ fontFamily: "'Geist Variable', 'Geist', sans-serif" }}>

      {/* ═══ Top Navigation Bar ═══ */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-8 border-b border-outline-variant/30 flex-shrink-0">

        {/* Left: back + title */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/student/quizzes")}
            className="p-2 hover:bg-surface-container rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} className="text-on-surface-variant" />
          </button>
          <div>
            <h1 className="text-[18px] font-bold text-primary leading-tight">{quiz.name}</h1>
            <p className="text-[12px] text-on-surface-variant uppercase tracking-wider leading-none mt-0.5">
              {quiz.module || "Assessment Module"}
            </p>
          </div>
        </div>

        {/* Right: progress + timer */}
        <div className="flex items-center gap-12">
          {/* Progress indicator */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <Progress value={progressPercent} className="w-48 bg-surface-container-highest [&>div]:bg-primary h-1.5" />
              <span className="text-[12px] font-semibold text-primary">{activeIdx + 1} of {quiz.questions.length}</span>
            </div>
            <span className="text-[14px] text-on-surface-variant">Question Progress</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3 bg-surface-container-highest px-6 py-2.5 rounded-xl border-2 border-primary shadow-sm">
            <Timer size={20} className="text-primary" />
            <span className="font-mono text-[20px] font-bold text-primary leading-none">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* ═══ Main Area ═══ */}
      <div className="flex-1 flex overflow-hidden w-full h-[calc(100vh-64px)]">

        {/* ─── Left Sidebar: Question Map ─── */}
        <aside className="w-64 shrink-0 border-r border-outline-variant bg-surface-container-low p-6 hidden lg:flex flex-col gap-6 overflow-y-auto">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">
              Question Map
            </h3>
            <span className="text-[12px] px-2 py-1 bg-surface-container-highest rounded-md text-on-surface-variant leading-none">
              {answeredCount}/{quiz.questions.length} Answered
            </span>
          </div>

          {/* Question number grid */}
          <div className="grid grid-cols-5 gap-2.5">
            {quiz.questions.map((_, idx) => {
              const isCurrent = idx === activeIdx;
              const isAnswered = answers[idx] !== undefined;
              const isFlagged = flagged[idx] === true;

              let btnClass;
              if (isCurrent) {
                btnClass = "border-2 border-primary text-primary font-bold bg-primary-fixed/20";
              } else if (isAnswered) {
                btnClass = "bg-primary text-on-primary font-bold";
              } else {
                btnClass = "border border-outline-variant text-on-surface-variant hover:border-primary transition-colors font-medium";
              }

              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`aspect-square w-full rounded-lg flex items-center justify-center text-[14px] relative cursor-pointer ${btnClass}`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-surface-container-low" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend + Flag */}
          <div className="mt-auto space-y-4">
            {/* Legend panel */}
            <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/50">
              <p className="text-[12px] text-on-surface-variant mb-2">Legend</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[14px] text-on-surface">Answered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full border-2 border-primary bg-primary-fixed/20" />
                  <span className="text-[14px] text-on-surface">Current</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full border border-outline-variant" />
                  <span className="text-[14px] text-on-surface">Not Viewed</span>
                </div>
              </div>
            </div>

            {/* Flag for Review button */}
            <button
              onClick={toggleFlag}
              className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition-colors cursor-pointer ${
                flagged[activeIdx]
                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                  : "text-primary hover:bg-primary-fixed/20"
              }`}
            >
              <Flag size={18} className={flagged[activeIdx] ? "fill-red-500 text-red-500" : ""} />
              <span className="text-[14px]">{flagged[activeIdx] ? "Flagged for Review" : "Flag for Review"}</span>
            </button>
          </div>
        </aside>

        {/* ─── Right: Main Quiz Content ─── */}
        <main className="flex-1 min-w-0 overflow-y-auto p-8 md:p-12 lg:p-16 flex flex-col">
          <div className="w-full flex-1 flex flex-col justify-between">
            <div>
              {/* Question type badge + question text */}
              <div className="mb-10 w-full">
                <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-md text-[12px] font-bold mb-4 uppercase">
                  Multiple Choice
                </span>
                <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface w-full">
                  {q?.question}
                </h2>
              </div>

              {/* Answer options */}
              <div className="space-y-4 mb-12">
                {["A", "B", "C", "D"].map((optKey) => {
                  const optText = q?.[`option${optKey}`];
                  const isSelected = answers[activeIdx] === optKey;

                  return (
                    <button
                      key={optKey}
                      onClick={() => handleSelectOption(optKey)}
                      type="button"
                      className="group block w-full relative cursor-pointer text-left transition-all duration-200"
                    >
                      <div className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary-fixed/10"
                          : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                      }`}>
                        {/* Letter circle */}
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-on-primary"
                              : "border-outline-variant text-on-surface-variant group-hover:border-primary group-hover:text-primary"
                          }`}
                        >
                          <span className="text-[14px] font-bold">{optKey}</span>
                        </div>

                        {/* Option text */}
                        <span className="text-[16px] text-on-surface flex-1">{optText}</span>

                        {/* Check icon */}
                        <CheckCircle2
                          size={20}
                          className={`ml-auto text-primary flex-shrink-0 transition-opacity ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── Navigation Controls ─── */}
            <div className="flex items-center justify-between pt-8 border-t border-outline-variant/30 mt-auto">
              {/* Previous */}
              <button
                onClick={handlePrev}
                disabled={activeIdx === 0}
                className="flex items-center gap-2 px-6 py-3 text-primary font-bold hover:bg-primary-fixed/20 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[14px]"
              >
                <ChevronLeft size={20} />
                <span>Previous</span>
              </button>

              {/* Right group */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/student/quizzes")}
                  className="px-6 py-3 border border-outline text-on-surface-variant font-bold rounded-xl hover:bg-surface-container transition-all text-[14px] cursor-pointer"
                >
                  Save Draft
                </button>
                {activeIdx < quiz.questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-10 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] text-[14px] cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-10 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] text-[14px] cursor-pointer disabled:opacity-60"
                  >
                    <span>Submit Exam</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
