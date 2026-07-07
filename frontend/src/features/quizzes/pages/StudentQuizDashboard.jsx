import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Clock, Percent, Calendar, CheckCircle, Play, Eye, BookOpen, Star } from "lucide-react";
import quizService from "../services/quizService";

export default function StudentQuizDashboard() {
  const navigate = useNavigate();
  const studentId = "s4"; // Active student: Jane Doe
  const studentBatch = "B-2024-Q1"; // Jane Doe's batch

  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({ assigned: 0, completed: 0, pending: 0, averageScore: 0 });

  useEffect(() => {
    quizService.getQuizzes(studentId).then(data => {
      setQuizzes(data || []);
    });
    quizService.getStudentQuizStats(studentId).then(data => {
      if (data) {
        setStats(data);
      }
    });
  }, []);

  return (
    <div className="p-4 md:p-7 xl:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-805 text-slate-800 tracking-tight flex items-center gap-2">
          <HelpCircle className="text-[#6C1D5F]" size={26} />
          Student Assessment Quizzes
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review assigned assessments, complete tests, and view feedback</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Quizzes</span>
          <div className="text-2xl font-black text-slate-850 text-slate-800 mt-0.5">{stats.assigned}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5">{stats.completed}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Attempts</span>
          <div className="text-2xl font-black text-slate-800 mt-0.5">{stats.pending}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] text-[#6C1D5F] font-bold uppercase tracking-wider">Average Score</span>
          <div className="text-2xl font-black text-[#6C1D5F] mt-0.5 flex items-center gap-1">
            {stats.averageScore}%
            <Star size={16} className="fill-[#6C1D5F]" />
          </div>
        </div>
      </div>

      {/* Quizzes List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pt-2">
        {quizzes.map((quiz) => {
          const isCompleted = quiz.attemptStatus === "Completed";
          const attempt = quiz;

          return (
            <div
              key={quiz.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col relative overflow-hidden ${
                isCompleted ? "border-emerald-100" : "border-slate-100"
              }`}
            >
              {/* Top Row: Course badge & Status badge */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] bg-[#ffd7f5] text-[#653660] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {quiz.course}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {isCompleted ? "Completed" : "Assigned"}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex-1 space-y-2">
                <h3 className="text-[14px] font-black text-slate-800 tracking-tight leading-snug">{quiz.name}</h3>
                {quiz.description && <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{quiz.description}</p>}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-3 gap-2 py-4 text-[10px] font-bold text-slate-500 border-t border-slate-50 mt-4">
                <div className="flex items-center gap-1">
                  <BookOpen size={12} className="text-slate-405" />
                  <span>{quiz.questionsCount} Questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-405" />
                  <span>{quiz.duration} mins</span>
                </div>
                <div className="flex items-center gap-1">
                  <Percent size={12} className="text-slate-405" />
                  <span>Pass: {quiz.passingMarks}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-slate-50 pt-4 flex gap-2">
                {isCompleted ? (
                  <>
                    {/* View Attempt score */}
                    <div className="flex-1 flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score Achieved</span>
                      <span className="text-xs font-bold text-slate-800">{attempt.score} / {quiz.questionsCount} ({attempt.percentage}%)</span>
                    </div>
                    <button
                      onClick={() => navigate(`/student/quizzes/${quiz.id}/result`)}
                      type="button"
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={14} /> Review
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/student/quizzes/${quiz.id}/play`)}
                    type="button"
                    className="w-full py-2 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Play size={14} className="fill-white" /> Start Assessment
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {quizzes.length === 0 && (
          <div className="col-span-full text-center py-16 space-y-4">
            <div className="w-14 h-14 bg-slate-105 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <HelpCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">No Quizzes Assigned</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Your coordinator has not published any quizzes for {studentBatch} yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
