import React from "react";
import { Filter } from "lucide-react";

const SubmissionFilters = React.memo(function SubmissionFilters({
  filterState,
  onFilterChange,
}) {
  const options = ["All", "Graded", "Pending Review", "Needs Revision"];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
      <h3 className="text-[14px] font-bold text-slate-855 flex items-center gap-1.5">
        <Filter size={16} className="text-slate-450" />
        Filter Submissions
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-bold border transition-colors cursor-pointer ${
              filterState === filter
                ? "bg-[#6C1D5F]/10 text-[#6C1D5F] border-[#6C1D5F]/20"
                : "bg-white text-slate-650 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
});

export default SubmissionFilters;
