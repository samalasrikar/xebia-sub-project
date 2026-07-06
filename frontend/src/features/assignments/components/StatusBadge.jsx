import React from "react";

/**
 * Maps a status string to a color-coded badge.
 * Reused across Gradebook, ManagerDashboard, StudentDashboard, StudentMySubmissions, SubmissionReview.
 */
const STATUS_STYLES = {
  "Graded":           "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Submitted":        "bg-amber-50 text-amber-700 border-amber-100",
  "Pending":          "bg-amber-50 text-amber-700 border-amber-100",
  "Pending Review":   "bg-amber-50 text-amber-700 border-amber-100",
  "Active":           "bg-[#01AC9F]/10 text-[#01AC9F] border-[#01AC9F]/20",
  "Completed":        "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Draft":            "bg-slate-100 text-slate-500 border-slate-200",
  "Revision Needed":  "bg-rose-50 text-rose-700 border-rose-100",
  "Needs Revision":   "bg-rose-50 text-rose-700 border-rose-100",
  "Overdue":          "bg-rose-50 text-rose-700 border-rose-100",
  "Reviewed":         "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Not Submitted":    "bg-slate-100 text-slate-500 border-slate-200",
};

const StatusBadge = React.memo(function StatusBadge({ status, label, className = "" }) {
  const colorClasses = STATUS_STYLES[status] || "bg-slate-100 text-slate-600 border-slate-200";
  const displayLabel = label || status;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClasses} ${className}`}
    >
      {displayLabel}
    </span>
  );
});

export default StatusBadge;
