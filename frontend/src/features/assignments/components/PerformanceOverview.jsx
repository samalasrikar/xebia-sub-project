import React from "react";
import { BarChart2 } from "lucide-react";

const PerformanceOverview = React.memo(function PerformanceOverview() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-5">
      <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-1.5">
        <BarChart2 size={16} className="text-[#6C1D5F]" />
        Performance Overview
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[12.5px] mb-1 font-semibold">
            <span className="text-slate-400">Course Progress</span>
            <span className="text-[#6C1D5F]">75%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#6C1D5F] rounded-full w-3/4"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl text-center">
            <span className="block text-3xl font-black text-[#6C1D5F] tracking-tighter">12</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">Completed</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl text-center">
            <span className="block text-3xl font-black text-amber-500 tracking-tighter">3</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PerformanceOverview;
