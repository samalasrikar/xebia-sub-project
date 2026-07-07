import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import assignmentService from "../services/assignmentService";
import {
  Download, FolderOpen, ChevronLeft, ChevronRight,
  ArrowLeft, FileText
} from "lucide-react";

import Toast from "../components/Toast";
import StatusBadge from "../components/StatusBadge";
import StudentListPanel from "../components/StudentListPanel";
import EvaluationForm from "../components/EvaluationForm";

export default function SubmissionReview() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showListMobile, setShowListMobile] = useState(!submissionId);

  // Grading form state
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");

  useEffect(() => {
    assignmentService.getSubmissions().then(data => {
      setSubmissions(data || []);
      const target = data.find(s => s.id === submissionId) || data[0];
      setSelectedSub(target);
      if (target) {
        setScore(target.score !== null ? target.score : "");
        setFeedback(target.feedback || "");
        setPrivateNotes(target.privateNotes || "");
      }
    });
  }, [submissionId]);

  const handleSelectStudent = useCallback((sub) => {
    setSelectedSub(sub);
    setScore(sub.score !== null ? sub.score : "");
    setFeedback(sub.feedback || "");
    setPrivateNotes(sub.privateNotes || "");
    setShowListMobile(false);
    navigate(`/trainer/assignments/review/${sub.id}`);
  }, [navigate]);

  const handleNextPrev = useCallback((direction) => {
    if (!selectedSub) return;
    const currentIndex = submissions.findIndex(s => s.id === selectedSub.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < submissions.length) {
      handleSelectStudent(submissions[nextIndex]);
    }
  }, [submissions, selectedSub, handleSelectStudent]);

  const handleSaveGrade = useCallback(async (customStatus = null) => {
    if (!selectedSub) return;
    if (score === "" && !customStatus) {
      setToast("Please enter a valid marks score.");
      return;
    }

    const gradeData = {
      score: score,
      feedback: feedback,
      privateNotes: privateNotes,
      evaluator: "Dr. Sarah Jenkins"
    };

    let updated;
    if (customStatus === "Reject") {
      updated = await assignmentService.rejectSubmission(selectedSub.id, gradeData);
    } else {
      updated = await assignmentService.gradeSubmission(selectedSub.id, gradeData);
    }

    if (updated) {
      setSubmissions(prev => prev.map(s => s.id === selectedSub.id ? updated : s));
      setSelectedSub(updated);
      setToast(customStatus === "Reject" ? "Submission Rejected." : "Submission Graded successfully!");
    }
  }, [selectedSub, score, feedback, privateNotes]);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto w-full h-[calc(100vh-100px)] md:h-[calc(100vh-140px)] flex gap-6 overflow-hidden animate-fadeIn">
        {/* Left Sidebar */}
        <StudentListPanel
          submissions={submissions}
          selectedSub={selectedSub}
          onSelect={handleSelectStudent}
          onBack={() => navigate("/trainer/gradebook")}
          className={showListMobile ? "flex" : "hidden md:flex"}
        />

        {/* Right Panel */}
        <div className={`flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm ${!showListMobile ? "flex" : "hidden md:flex"}`}>
          {selectedSub ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowListMobile(true)}
                    className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={selectedSub.status} />
                      <span className="text-[11.5px] text-slate-400 font-semibold">{selectedSub.assignmentTitle}</span>
                    </div>
                    <h2 className="text-[18px] font-bold text-slate-850">
                      Student: <span className="text-slate-800">{selectedSub.studentName}</span>
                    </h2>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleNextPrev(-1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
                    disabled={submissions.findIndex(s => s.id === selectedSub.id) === 0}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => handleNextPrev(1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
                    disabled={submissions.findIndex(s => s.id === selectedSub.id) === submissions.length - 1}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Submitted Files */}
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/20">
                  <h3 className="text-[13.5px] font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                    <FolderOpen size={16} className="text-[#6C1D5F]" />
                    Submitted Files
                  </h3>
                  {selectedSub.files.length === 0 ? (
                    <p className="text-[12.5px] text-slate-400">No attachments provided.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedSub.files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-slate-200/80 rounded-lg bg-white hover:border-[#6C1D5F]/35 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 rounded bg-[#6C1D5F]/5 text-[#6C1D5F] flex items-center justify-center shrink-0">
                              <FileText size={16} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[12.5px] font-bold text-slate-700 truncate group-hover:text-[#6C1D5F] transition-colors">{file.name}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{file.size}</p>
                            </div>
                          </div>
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); alert(`Downloading ${file.name}...`); }}
                            className="text-slate-400 hover:text-[#6C1D5F] transition-colors p-1"
                          >
                            <Download size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Student's Note */}
                {selectedSub.studentNote && (
                  <div>
                    <h3 className="text-[13.5px] font-bold text-slate-750 mb-2">Student's Note</h3>
                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-[13px] text-slate-650 leading-relaxed italic">
                      "{selectedSub.studentNote}"
                    </div>
                  </div>
                )}

                {/* Evaluation Form */}
                <EvaluationForm
                  score={score}
                  feedback={feedback}
                  privateNotes={privateNotes}
                  onScoreChange={setScore}
                  onFeedbackChange={setFeedback}
                  onPrivateNotesChange={setPrivateNotes}
                  onSaveDraft={() => handleSaveGrade("Draft")}
                  onReject={() => handleSaveGrade("Reject")}
                  onRequestRevision={() => navigate("/trainer/gradebook")}
                  onApprove={() => handleSaveGrade()}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a student to load details.
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </AppLayout>
  );
}
