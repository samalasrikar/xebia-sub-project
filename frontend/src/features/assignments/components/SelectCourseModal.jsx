import React, { useState, useEffect } from "react";
import { X, Info, CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";

export default function SelectCourseModal({ isOpen, onClose, autoAssign, onApply, courseTitle = "Cloud Native Engineering" }) {
  const [localAutoAssign, setLocalAutoAssign] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalAutoAssign(autoAssign);
    }
  }, [isOpen, autoAssign]);

  const handleConfirm = () => {
    onApply(localAutoAssign);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] md:w-[672px] max-w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Assign to Entire Course</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer animate-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Informational Section */}
          <div className="flex gap-3 p-4 rounded-lg bg-[#ffd7f0]/30 border border-[#ffd7f0] text-slate-700">
            <div className="flex-shrink-0 mt-0.5">
              <Info size={16} className="text-[#6C1D5F]" />
            </div>
            <div className="space-y-1">
              <p className="text-[#6C1D5F] font-bold text-xs">Visibility Notice</p>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                This assignment will be immediately visible to every student currently enrolled in the course. Automated notifications will be dispatched to all batches.
              </p>
            </div>
          </div>

          {/* Course Scope Summary */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Scope Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 mb-0.5">Target Course</p>
                <p className="text-xs font-bold text-slate-700">{courseTitle}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 mb-0.5">Student Coverage</p>
                <p className="text-xs font-bold text-slate-700">
                  All Students <span className="text-slate-400 font-medium text-[10px]">across enrolled batches</span>
                </p>
              </div>
            </div>
          </div>

          {/* Options / Toggle Section */}
          <div className="py-2 flex flex-col gap-1.5">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative inline-flex items-center">
                <input
                  className="sr-only peer"
                  type="checkbox"
                  checked={localAutoAssign}
                  onChange={(e) => setLocalAutoAssign(e.target.checked)}
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6C1D5F]"></div>
              </div>
              <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                Auto-assign to future enrollments
              </span>
            </label>
            <p className="ml-12 text-[10px] text-slate-400 leading-normal">
              New students joining this course will automatically receive this assignment.
            </p>
          </div>
        </div>

        {/* Footer / Action Bar */}
        <div className="px-8 py-5 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-7 py-2 rounded-lg bg-[#6C1D5F] text-white hover:bg-[#4A1E47] transition-all text-xs font-bold active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Confirm Assignment</span>
            <CheckCircle size={12} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
