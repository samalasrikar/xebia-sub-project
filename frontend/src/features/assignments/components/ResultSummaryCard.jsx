import React from "react";
import { BookOpen, Calendar } from "lucide-react";

const ResultSummaryCard = React.memo(function ResultSummaryCard({
  assignment,
  submission,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#6C1D5F]"></div>
      <h2 className="text-[15px] font-bold text-slate-850 mb-5 flex items-center gap-1.5">
        <BookOpen size={16} className="text-[#6C1D5F]" /> Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[13px]">
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Module</p>
          <p className="font-semibold text-slate-700">{assignment.course}</p>
        </div>
        
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Submitted On</p>
          <p className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" />
            {submission.submittedAt}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Prompt Details</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-650 text-[12.5px] leading-relaxed">
            {assignment.description}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResultSummaryCard;
