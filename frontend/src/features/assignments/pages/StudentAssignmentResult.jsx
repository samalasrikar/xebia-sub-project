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
      } else {
        const fallbackSub = {
          id: "sub_mock",
          assignmentId: id,
          assignmentTitle: asData?.title || "Database Normalization Quiz",
          studentName: "Jane Doe",
          submittedAt: "Oct 24, 2023, 14:30 EST",
          score: 85,
          feedback: "Overall, this is a solid submission that meets the core requirements of the prompt. The use of React hooks for state management is commendable, and the Tailwind implementation is clean and responsive.\n\nStrengths:\n- Excellent component architecture; separation of concerns is clear.\n- API integration is robust, handling loading and error states gracefully.\n- Responsive design works flawlessly across mobile and desktop breakpoints.\n\nAreas for Improvement:\n- The filtering logic could be optimized. Currently, it filters on every keystroke, which might cause performance issues with larger datasets. Consider implementing debouncing.\n- Accessibility (a11y) needs attention. Some interactive elements are missing aria-labels, and keyboard navigation is incomplete.\n\nKeep up the good work! Focus on performance optimization and accessibility in the next module.",
          evaluator: "Dr. Sarah Jenkins",
          evaluatedDate: "Oct 26, 2023",
          files: [
            { name: "project_report.pdf", size: "2.4 MB" },
            { name: "source_code.zip", size: "15.1 MB" }
          ]
        };
        setSubmission(fallbackSub);
      }
    });
  }, [id]);

  if (!assignment || !submission) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading assignment result...
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Dashboard", to: "/student" },
    { label: "Assignments", to: "/student/assignments" },
    { label: "Results" },
  ];

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
