import React from "react";
import { Clock, Upload } from "lucide-react";
import StatusBadge from "./StatusBadge";

const SubmissionCard = React.memo(function SubmissionCard({
  sub,
  assignment,
  onNavigateResubmit,
  onNavigateDetails,
  onNavigateResult,
}) {
  let accentColor = "border-l-slate-300";
  let statusLabel = sub.status;

  if (sub.status === "Graded") {
    accentColor = "border-l-emerald-500";
    statusLabel = "Graded";
  } else if (sub.status === "Submitted" || sub.status === "Pending") {
    accentColor = "border-l-[#f59e0b]";
    statusLabel = "Pending Review";
  } else if (sub.status === "Revision Needed") {
    accentColor = "border-l-rose-500";
    statusLabel = "Revision Needed";
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 border-l-4 ${accentColor} overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-300 relative`}
    >
      <div className="p-6 flex-1 flex flex-col justify-between pl-8">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[14.5px] font-bold text-slate-800">
              Attempt {sub.attempt} - {sub.assignmentTitle}
            </h3>
            <StatusBadge status={sub.status} label={statusLabel} />
          </div>
          <p className="text-[12px] text-slate-400 mb-4 flex items-center gap-1">
            <Clock size={13} />
            Submitted: {sub.submittedAt}
          </p>
        </div>

        {/* Feedback Container */}
        {sub.status === "Graded" && (
          <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Manager Feedback</span>
              <span className="text-[13px] font-extrabold text-emerald-600">{sub.score} / 100</span>
            </div>
            <p className="text-[12.5px] text-slate-650 leading-relaxed">
              "{sub.feedback}"
            </p>
          </div>
        )}

        {(sub.status === "Submitted" || sub.status === "Pending") && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 border-dashed flex items-center justify-center min-h-[70px]">
            <p className="text-[12px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock size={14} className="animate-spin text-amber-500" />
              Awaiting review from assigned manager.
            </p>
          </div>
        )}

        {sub.status === "Revision Needed" && (
          <div className="bg-rose-50/30 p-4 rounded-xl border border-rose-100/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Revision Comments</span>
              <span className="text-[13px] font-extrabold text-rose-500">-- / 100</span>
            </div>
            <p className="text-[12.5px] text-slate-650 leading-relaxed">
              "{sub.feedback}"
            </p>
          </div>
        )}
      </div>

      {/* Right Button Column */}
      <div className="bg-slate-50/50 p-6 border-t sm:border-t-0 sm:border-l border-slate-100 flex sm:flex-col justify-center items-center gap-3 min-w-[150px]">
        {sub.status === "Revision Needed" ? (
          <>
            <button
              onClick={onNavigateResubmit}
              className="w-full text-center px-4 py-1.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-[12px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
            >
              <Upload size={13} /> Resubmit
            </button>
            <button
              onClick={onNavigateResult}
              className="w-full text-center px-4 py-1.5 border border-slate-200 bg-white text-slate-750 text-[12px] font-bold rounded-lg hover:bg-slate-50 transition-colors hidden sm:block"
            >
              Details
            </button>
          </>
        ) : sub.status === "Graded" ? (
          <button
            onClick={onNavigateResult}
            className="w-full text-center px-4 py-1.5 border border-[#6C1D5F] bg-white text-[#6C1D5F] hover:bg-[#6C1D5F]/5 text-[12px] font-bold rounded-lg transition-colors cursor-pointer"
          >
            Result Details
          </button>
        ) : (
          <button
            onClick={onNavigateDetails}
            className="w-full text-center px-4 py-1.5 border border-slate-200 bg-white text-slate-750 text-[12px] font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
});

export default SubmissionCard;
