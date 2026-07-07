import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";

/**
 * Scheduling card for CreateAssignment.
 * Contains due date, due time, and late submission toggle.
 */
const SchedulingCard = React.memo(function SchedulingCard({ formData, onChange }) {
  return (
    <Card className="bg-white rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#84117C]" />
      <CardContent className="p-6">
        <h3 className="text-[15px] font-bold text-slate-800 mb-5 flex items-center gap-2">
          <CalendarIcon size={18} className="text-[#84117C]" />
          Scheduling
        </h3>
        <div className="space-y-4">
          {/* Due Date */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">Due Date & Time</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-[#6C1D5F] transition-colors h-9 font-semibold"
                type="date"
                value={formData.dueDate}
                onChange={(e) => onChange("dueDate", e.target.value)}
              />
              <Input
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-[#6C1D5F] transition-colors h-9 font-semibold"
                type="time"
                value={formData.dueTime}
                onChange={(e) => onChange("dueTime", e.target.value)}
              />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-2" />

          {/* Late Submission Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <label className="text-[14px] text-slate-700 font-semibold block mb-0.5 cursor-pointer">
                Allow Late Submissions
              </label>
              <p className="text-[11.5px] text-slate-400">Flag as late but accept uploads.</p>
            </div>
            <button
              type="button"
              onClick={() => onChange("allowLate", !formData.allowLate)}
              className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${formData.allowLate ? "bg-[#6C1D5F]" : "bg-slate-200"}`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${formData.allowLate ? "right-0.5" : "left-0.5"}`}
              />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default SchedulingCard;
