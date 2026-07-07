import React, { useState, useEffect, useMemo } from "react";
import { X, Trophy, CheckCircle, XCircle, Clock, Percent, FileText, User } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import quizService from "../services/quizService";

export default function ViewResultsModal({ isOpen, onClose, quizId }) {
  const [results, setResults] = useState([]);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState("All Students");
  const [selectedBatchFilter, setSelectedBatchFilter] = useState("All Batches");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && quizId) {
      setLoading(true);
      quizService.getQuizResults(quizId).then(data => {
        setResults(data || []);
        setSelectedStudentFilter("All Students");
        setSelectedBatchFilter("All Batches");
        setLoading(false);
      });
    }
  }, [isOpen, quizId]);

  // Extract unique batches and students for filters
  const batches = useMemo(() => {
    const set = new Set(results.map(r => r.batch));
    return Array.from(set);
  }, [results]);

  const students = useMemo(() => {
    const set = new Set(results.map(r => r.studentName));
    return Array.from(set);
  }, [results]);

  // Filtered results
  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const matchesBatch = selectedBatchFilter === "All Batches" || r.batch === selectedBatchFilter;
      const matchesStudent = selectedStudentFilter === "All Students" || r.studentName === selectedStudentFilter;
      return matchesBatch && matchesStudent;
    });
  }, [results, selectedBatchFilter, selectedStudentFilter]);

  // Select the active result to display. Defaults to the first filtered result.
  const activeResult = filteredResults[0] || null;

  // Stats for the active result
  const stats = useMemo(() => {
    if (!activeResult) return null;
    const total = activeResult.answers.length;
    const correct = activeResult.answers.filter(a => a.studentAnswer === a.correctAnswer).length;
    const incorrect = total - correct;
    const score = activeResult.score;
    const percentage = activeResult.percentage;
    return { total, correct, incorrect, score, percentage };
  }, [activeResult]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] md:w-[850px] max-w-full max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Trophy size={18} className="text-[#6C1D5F]" />
              Quiz Assessment Results
            </h1>
            <p className="text-[11px] text-slate-405 text-slate-400 mt-0.5">Analyze and review submissions made by students</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters Top Bar */}
        <div className="px-6 py-4 bg-slate-50/40 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 flex-shrink-0">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-405 text-slate-500">Filter Cohort / Batch</label>
            <Select value={selectedBatchFilter} onValueChange={setSelectedBatchFilter}>
              <SelectTrigger className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F] cursor-pointer h-8 font-semibold">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Batches">All Batches</SelectItem>
                {batches.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-405 text-slate-500">Select Student Attempt</label>
            <Select value={selectedStudentFilter} onValueChange={setSelectedStudentFilter}>
              <SelectTrigger className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6C1D5F] cursor-pointer h-8 font-semibold">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Students">All Students</SelectItem>
                {students.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-16 text-slate-405 text-slate-400 text-xs">Loading quiz attempts...</div>
          ) : !activeResult ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText size={20} />
              </div>
              <p className="text-xs font-bold text-slate-500">No attempts found matching the selected filters.</p>
            </div>
          ) : (
            <>
              {/* Student info card */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6C1D5F]/10 text-[#6C1D5F] flex items-center justify-center font-bold text-xs">
                    <User size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{activeResult.studentName}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">ID: {activeResult.studentId} • Batch: {activeResult.batch}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-505 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    <span>Duration: {activeResult.timeTaken}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Percent size={14} className="text-slate-400" />
                    <span>Submitted: {activeResult.attemptDate}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeResult.status === "Pass" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {activeResult.status}
                  </span>
                </div>
              </div>

              {/* Stat Cards Grid */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Questions</span>
                    <div className="text-base font-black text-slate-800 mt-0.5">{stats.total}</div>
                  </div>
                  <div className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Correct Answers</span>
                    <div className="text-base font-black text-emerald-700 mt-0.5">{stats.correct}</div>
                  </div>
                  <div className="bg-red-55/30 bg-red-50/30 p-3 rounded-lg border border-red-100">
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Incorrect Answers</span>
                    <div className="text-base font-black text-red-700 mt-0.5">{stats.incorrect}</div>
                  </div>
                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Marks Scored</span>
                    <div className="text-base font-black text-slate-800 mt-0.5">{stats.score}</div>
                  </div>
                  <div className="bg-[#6C1D5F]/5 p-3 rounded-lg border border-[#6C1D5F]/10">
                    <span className="text-[10px] text-[#6C1D5F] font-bold uppercase tracking-wider">Percentage</span>
                    <div className="text-base font-black text-[#6C1D5F] mt-0.5">{stats.percentage}%</div>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[11px] font-bold text-[#6C1D5F] uppercase tracking-wider">Detailed Submission Review</h3>
                <div className="space-y-4">
                  {activeResult.answers.map((ans, idx) => {
                    const isCorrect = ans.studentAnswer === ans.correctAnswer;
                    return (
                      <div
                        key={idx}
                        className={`p-4 border rounded-xl relative ${
                          isCorrect ? "border-emerald-100 bg-emerald-50/10" : "border-red-100 bg-red-50/10"
                        }`}
                      >
                        <div className="absolute right-4 top-4 flex items-center gap-1 text-[10px] font-bold">
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

                        <div className="space-y-2 pr-16">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Question #{idx + 1}</span>
                          <h4 className="text-xs font-bold text-slate-800">{ans.question}</h4>
                          <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold pt-1">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Student's Response:</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              }`}>
                                Option {ans.studentAnswer}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Correct Answer:</span>
                              <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-lg bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-all text-xs font-bold active:scale-95 shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
