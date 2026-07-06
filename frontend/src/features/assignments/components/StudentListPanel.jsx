import React from "react";
import { ArrowLeft } from "lucide-react";
import StudentAvatarCell from "./StudentAvatarCell";
import StatusBadge from "./StatusBadge";

/**
 * Left sidebar panel listing all student submissions for selection.
 * Used in SubmissionReview.
 */
const StudentListPanel = React.memo(function StudentListPanel({
  submissions,
  selectedSub,
  onSelect,
  onBack,
  className = "",
}) {
  return (
    <div className={`w-full md:w-[320px] bg-white border border-slate-200 rounded-2xl flex flex-col flex-shrink-0 overflow-hidden shadow-sm ${className}`}>
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={14} />
        </button>
        <div>
          <h2 className="text-[14px] font-bold text-slate-800">Review Submissions</h2>
          <p className="text-[11px] text-slate-450">Select student to grade</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {submissions.map((s) => {
          const isSelected = selectedSub && selectedSub.id === s.id;
          return (
            <div
              key={s.id}
              onClick={() => onSelect(s)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#6C1D5F]/5 border-[#6C1D5F]/30"
                  : "border-transparent hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              <StudentAvatarCell name={s.studentName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 truncate">{s.studentName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {s.submittedAt ? `Submitted ${s.submittedAt}` : "Not submitted yet"}
                </p>
              </div>
              <StatusBadge status={s.status} className="text-[9px] px-1.5" />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default StudentListPanel;
