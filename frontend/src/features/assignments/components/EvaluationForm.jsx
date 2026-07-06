import React from "react";
import { Lock } from "lucide-react";

/**
 * Evaluation and grading form used in SubmissionReview.
 * Contains marks input, feedback textarea, private notes, and action buttons.
 */
const EvaluationForm = React.memo(function EvaluationForm({
  score,
  feedback,
  privateNotes,
  onScoreChange,
  onFeedbackChange,
  onPrivateNotesChange,
  onSaveDraft,
  onReject,
  onRequestRevision,
  onApprove,
}) {
  return (
    <div className="p-5 border border-slate-200 rounded-xl bg-white border-l-4 border-l-[#6C1D5F] space-y-5">
      <h3 className="text-[14px] font-bold text-slate-800">Evaluation & Grading</h3>

      {/* Marks input */}
      <div>
        <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">Marks / Score</label>
        <div className="flex items-center gap-2">
          <input
            className="w-24 h-10 px-3 rounded-lg border border-slate-200 bg-white font-semibold text-slate-750 focus:border-[#6C1D5F] outline-none transition-colors"
            placeholder="e.g. 85"
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) => onScoreChange(e.target.value)}
          />
          <span className="text-[13px] text-slate-400">/ 100</span>
        </div>
      </div>

      {/* Feedback */}
      <div>
        <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">Feedback (Visible to Student)</label>
        <textarea
          className="w-full h-28 p-3 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-750 focus:border-[#6C1D5F] outline-none transition-colors resize-y"
          placeholder="Provide constructive grading feedback..."
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
        />
      </div>

      {/* Private Notes */}
      <div>
        <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
          <Lock size={12} className="text-slate-400" />
          Private Notes (Internal Reviewer Eyes Only)
        </label>
        <textarea
          className="w-full h-20 p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-[13px] text-slate-750 focus:border-[#6C1D5F] outline-none transition-colors resize-y"
          placeholder="Review logs for other faculty admins..."
          value={privateNotes}
          onChange={(e) => onPrivateNotesChange(e.target.value)}
        />
      </div>

      {/* Actions Footer */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={onSaveDraft}
          className="px-4 py-1.5 rounded-md text-[12.5px] font-bold text-[#6C1D5F] border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={onReject}
          className="px-4 py-1.5 rounded-md text-[12.5px] font-bold text-rose-500 border border-rose-200 hover:bg-rose-50 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={onRequestRevision}
          className="px-4 py-1.5 rounded-md text-[12.5px] font-bold text-slate-650 border border-slate-200 hover:bg-slate-50/70 transition-colors"
        >
          Request Revision
        </button>
        <button
          onClick={onApprove}
          className="px-5 py-1.5 rounded-md text-[12.5px] font-bold bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-colors shadow-sm"
        >
          Approve & Grade
        </button>
      </div>
    </div>
  );
});

export default EvaluationForm;
