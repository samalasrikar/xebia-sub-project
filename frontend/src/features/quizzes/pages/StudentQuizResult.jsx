import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trophy, CheckCircle, XCircle, Clock, Percent, ArrowLeft, RefreshCw } from "lucide-react";
import quizService from "../services/quizService";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";

export default function StudentQuizResult() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const studentId = "s4"; // Active student: Jane Doe

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      quizService.getQuizById(quizId),
      quizService.getStudentResult(quizId, studentId)
    ]).then(([q, myAttempt]) => {
      setQuiz(q || null);
      setAttempt(myAttempt || null);
      setLoading(false);
    }).catch(() => {
      setQuiz(null);
      setAttempt(null);
      setLoading(false);
    });
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[50vh]">
        <div className="text-slate-400 text-xs">Loading Quiz Results...</div>
      </div>
    );
  }

  if (!quiz || !attempt) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Trophy size={20} />
        </div>
        <h2 className="text-sm font-bold text-slate-700">No Attempt Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">We couldn't locate any completed attempt for this assessment.</p>
        <Button
          onClick={() => navigate("/student/quizzes")}
          className="bg-[#6C1D5F] hover:bg-[#4A1E47] text-white font-bold text-xs rounded-xl h-10"
        >
          Back to Quizzes
        </Button>
      </div>
    );
  }

  // Count correct/incorrect
  const stats = {
    total: attempt.answers.length,
    correct: attempt.answers.filter(a => a.studentAnswer === a.correctAnswer).length,
    incorrect: attempt.answers.length - attempt.answers.filter(a => a.studentAnswer === a.correctAnswer).length,
    score: attempt.score,
    percentage: attempt.percentage,
    status: attempt.status,
    timeTaken: attempt.timeTaken,
    date: attempt.attemptDate
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/student/quizzes")}
          variant="outline"
          className="text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-xs flex items-center gap-1 shadow-sm h-8"
        >
          <ArrowLeft size={14} />
          <span>Back to Quizzes</span>
        </Button>
        <Button
          onClick={() => navigate(`/student/quizzes/${quizId}/play`)}
          variant="outline"
          className="border-[#6C1D5F] text-[#6C1D5F] rounded-xl hover:bg-[#6C1D5F]/5 font-bold text-xs flex items-center gap-1 h-8"
        >
          <RefreshCw size={12} />
          <span>Retake Quiz</span>
        </Button>
      </div>

      {/* Main Scorecard Banner */}
      <Card className="bg-white border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${
            stats.status === "Pass" ? "bg-emerald-600" : "bg-red-600"
          }`}>
            <Trophy size={28} />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">{quiz.course}</span>
            <h1 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-tight mt-0.5">{quiz.name}</h1>
            <p className="text-[10px] text-slate-400 mt-1">Submitted on {stats.date} • Duration: {stats.timeTaken}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Verdict</span>
            <span className={`text-base font-black uppercase tracking-wider ${
              stats.status === "Pass" ? "text-emerald-600" : "text-red-600"
            }`}>
              {stats.status === "Pass" ? "Passed" : "Failed"}
            </span>
          </div>
          <Badge className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider h-7 ${
            stats.status === "Pass" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-red-50 text-red-700 hover:bg-red-50"
          }`}>
            {stats.percentage}%
          </Badge>
        </div>
      </Card>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-100 shadow-sm">
          <CardContent className="p-4 flex flex-col gap-1 w-full">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Questions</span>
            <div className="text-base font-black text-slate-800 mt-0.5">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/40 border border-emerald-100 shadow-none">
          <CardContent className="p-4 flex flex-col gap-1 w-full">
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Correct</span>
            <div className="text-base font-black text-emerald-700 mt-0.5">{stats.correct}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/45 border border-red-100 shadow-none">
          <CardContent className="p-4 flex flex-col gap-1 w-full">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Incorrect</span>
            <div className="text-base font-black text-red-700 mt-0.5">{stats.incorrect}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#6C1D5F]/5 border border-[#6C1D5F]/10 shadow-none">
          <CardContent className="p-4 flex flex-col gap-1 w-full">
            <span className="text-[10px] text-[#6C1D5F] font-bold uppercase tracking-wider">Score Scored</span>
            <div className="text-base font-black text-[#6C1D5F] mt-0.5">{stats.score} / {stats.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Questions Review */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-bold text-[#6C1D5F] uppercase tracking-wider">Question Review</h2>
        <div className="space-y-4">
          {attempt.answers.map((ans, idx) => {
            const isCorrect = ans.studentAnswer === ans.correctAnswer;
            return (
              <div
                key={idx}
                className={`p-5 border rounded-xl relative ${
                  isCorrect ? "border-emerald-100 bg-emerald-50/10" : "border-red-100 bg-red-50/10"
                }`}
              >
                <div className="absolute right-5 top-5 flex items-center gap-1 text-[10px] font-bold">
                  {isCorrect ? (
                    <span className="text-emerald-700 flex items-center gap-0.5">
                      <CheckCircle size={12} /> Correct
                    </span>
                  ) : (
                    <span className="text-red-700 flex items-center gap-0.5">
                      <XCircle size={12} /> Incorrect
                    </span>
                  )}
                </div>

                <div className="space-y-3 pr-16">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Question #{idx + 1}</span>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{ans.question}</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold pt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Your Answer:</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        Option {ans.studentAnswer || "None"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Correct Answer:</span>
                      <span className="bg-emerald-105 bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Option {ans.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
