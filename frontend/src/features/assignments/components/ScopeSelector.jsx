import React from "react";
import { Users } from "lucide-react";

/**
 * Assignment scope radio selector card for CreateAssignment.
 */
const ScopeSelector = React.memo(function ScopeSelector({ scope, onChange }) {
  const options = [
    { value: "Entire Course", label: "Entire Course", description: null },
    { value: "Specific Batches", label: "Specific Batches", description: "Select specific cohorts" },
    { value: "Individual Students", label: "Individual Students", description: "Custom selection" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
      <h3 className="text-[15px] font-bold text-slate-800 mb-5 flex items-center gap-2">
        <Users size={18} className="text-slate-500" />
        Assignment Scope
      </h3>
      <div className="space-y-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              scope === opt.value ? "border-[#6C1D5F] bg-[#6C1D5F]/5" : "border-slate-200 hover:border-[#6C1D5F]/30"
            }`}
          >
            <input
              checked={scope === opt.value}
              onChange={() => onChange("scope", opt.value)}
              className="w-4 h-4 text-[#6C1D5F] focus:ring-[#6C1D5F]"
              name="scope"
              type="radio"
            />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-slate-700">{opt.label}</span>
              {opt.description && (
                <span className="text-[11px] text-slate-400">{opt.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
});

export default ScopeSelector;
