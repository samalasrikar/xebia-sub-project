import React from "react";
import { CheckCircle } from "lucide-react";

const ScoreGauge = React.memo(function ScoreGauge({
  score,
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // 282.74
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6 w-full text-left">Final Grade</h3>
      
      <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle className="text-slate-100" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="8" />
          {/* Progress circle */}
          <circle
            className="text-[#6C1D5F]"
            cx="50"
            cy="50"
            fill="transparent"
            r="45"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black text-[#6C1D5F] leading-none">{score}</span>
          <span className="text-[11px] text-slate-400 mt-1">/100</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Percentage</p>
          <p className="text-[18px] font-black text-slate-750">{score}%</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grade</p>
          <p className="text-[18px] font-black text-[#6C1D5F]">
            {score >= 90 ? "A" : score >= 80 ? "B" : "C"}
          </p>
        </div>
      </div>

      <div className="w-full mt-5">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] uppercase tracking-wider border border-emerald-100">
          <CheckCircle size={13} /> Pass
        </span>
      </div>
    </div>
  );
});

export default ScoreGauge;
