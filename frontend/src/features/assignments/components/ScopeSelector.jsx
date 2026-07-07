import React from "react";
import { Users, Settings } from "lucide-react";

/**
 * Assignment scope radio selector card for CreateAssignment.
 */
const ScopeSelector = React.memo(function ScopeSelector({
  scope,
  onChange,
  selectedBatches = [],
  selectedStudents = [],
  autoAssign = false,
  onOpenBatchesModal,
  onOpenStudentsModal,
  onOpenCourseModal
}) {
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
        {options.map((opt) => {
          const isSelected = scope === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => onChange("scope", opt.value)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isSelected ? "border-[#6C1D5F] bg-[#6C1D5F]/5" : "border-slate-200 hover:border-[#6C1D5F]/30"
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  checked={isSelected}
                  onChange={() => onChange("scope", opt.value)}
                  className="w-4 h-4 text-[#6C1D5F] focus:ring-[#6C1D5F]/20 transition-colors accent-[#6C1D5F] cursor-pointer"
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

              {/* Entire Course details */}
              {isSelected && opt.value === "Entire Course" && (
                <div className="mt-3 pl-7 pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCourseModal();
                    }}
                    className="self-start px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Settings size={12} />
                    Configure Course Scope
                  </button>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Auto-assign: <span className="font-bold text-slate-700">{autoAssign ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              )}

              {/* Specific Batches details */}
              {isSelected && opt.value === "Specific Batches" && (
                <div className="mt-3 pl-7 pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBatchesModal();
                    }}
                    className="self-start px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Settings size={12} />
                    Configure Batches ({selectedBatches.length})
                  </button>
                  {selectedBatches.length > 0 && (
                    <div className="text-[11px] text-slate-500 font-medium">
                      Selected: <span className="font-bold text-slate-700">{selectedBatches.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Individual Students details */}
              {isSelected && opt.value === "Individual Students" && (
                <div className="mt-3 pl-7 pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStudentsModal();
                    }}
                    className="self-start px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Settings size={12} />
                    Configure Students ({selectedStudents.length})
                  </button>
                  {selectedStudents.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 max-h-[80px] overflow-y-auto pr-1">
                      {selectedStudents.map(studentName => (
                        <span key={studentName} className="px-2 py-0.5 bg-[#6C1D5F]/10 text-[#6C1D5F] text-[10px] font-bold rounded-full">
                          {studentName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ScopeSelector;
