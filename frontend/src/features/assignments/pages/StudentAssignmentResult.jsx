import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assignmentService from "../services/assignmentService";
import { ChevronRight, FileText, ArrowLeft } from "lucide-react";

import Breadcrumbs from "../components/Breadcrumbs";
import FileCard from "../components/FileCard";
import ResultSummaryCard from "../components/ResultSummaryCard";
import EvaluatorFeedbackCard from "../components/EvaluatorFeedbackCard";
import ScoreGauge from "../components/ScoreGauge";

export default function StudentAssignmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = "s4";

  useEffect(() => {
    Promise.all([
      assignmentService.getAssignmentById(id),
      assignmentService.getStudentSubmissions(studentId)
    ]).then(([asData, subData]) => {
      setAssignment(asData);
      const sub = subData.find(s => s.assignmentId === id && s.status === "Graded");
      
      if (sub) {
        setSubmission(sub);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  const breadcrumbItems = [
    { label: "Dashboard", to: "/student" },
    { label: "Assignments", to: "/student/assignments" },
    { label: "Results" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading assignment result...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Assignment not found.
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-[1050px] w-full mx-auto px-6 md:px-8 py-8 space-y-6 animate-fadeIn pb-12">
        {/* Breadcrumbs & Header */}
        <div className="space-y-3">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/student/assignments/${assignment.id}/submissions`)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Assignment Feedback</h1>
              <p className="text-[13px] text-slate-400 mt-1">{assignment.title}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
          No graded submission found for this assignment.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1050px] w-full mx-auto px-6 md:px-8 py-8 space-y-6 animate-fadeIn pb-12">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/student/assignments/${assignment.id}/submissions`)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Assignment Feedback</h1>
            <p className="text-[13px] text-slate-400 mt-1">{assignment.title}</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Result Details & Feedback */}
        <div className="lg:col-span-8 space-y-6">
          <ResultSummaryCard assignment={assignment} submission={submission} />
          <EvaluatorFeedbackCard submission={submission} />
        </div>

        {/* Right Column: Grade & Files */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ScoreGauge score={submission.score} />

          {/* Submitted Artifacts Card */}
          {submission.files && submission.files.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex-grow">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <FileText size={14} className="text-slate-400" /> Submitted Artifacts
              </h3>
              <ul className="space-y-2.5">
                {submission.files.map((file, idx) => (
                  <li key={idx}>
                    <FileCard
                      name={file.name}
                      size={file.size}
                      onClick={() => alert(`Downloading ${file.name}...`)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
