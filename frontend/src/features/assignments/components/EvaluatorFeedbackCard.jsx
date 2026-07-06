import React from "react";
import { Award, Clock } from "lucide-react";

const EvaluatorFeedbackCard = React.memo(function EvaluatorFeedbackCard({
  submission,
}) {
  const evaluatorInitials = submission.evaluator
    .split(" ")
    .map(n => n[0])
    .join("");

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group">
      <h2 className="text-[15px] font-bold text-slate-855 mb-4 flex items-center gap-1.5">
        <Award size={16} className="text-[#84117C]" /> Evaluator Feedback
      </h2>
      <div className="text-[13px] text-slate-650 leading-relaxed whitespace-pre-line">
        {submission.feedback}
      </div>

      {/* Evaluator Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#84117C]/10 text-[#84117C] flex items-center justify-center font-bold text-xs">
            {evaluatorInitials}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-[13px]">{submission.evaluator}</p>
            <p className="text-[11px] text-slate-400 font-semibold">Lead Instructor</p>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Clock size={12} /> Evaluated: {submission.evaluatedDate}
        </span>
      </div>
    </div>
  );
});

export default EvaluatorFeedbackCard;
