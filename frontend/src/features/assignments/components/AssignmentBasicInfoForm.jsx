import React from "react";
import { FileText } from "lucide-react";
import FormattingToolbar from "./FormattingToolbar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

/**
 * Basic information form section for CreateAssignment.
 * Contains title, type, max marks, description (with toolbar), and instructions fields.
 */
const AssignmentBasicInfoForm = React.memo(function AssignmentBasicInfoForm({ formData, onChange }) {
  return (
    <Card className="bg-white rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#6C1D5F]" />
      <CardContent className="p-6">
        <h3 className="text-[15px] font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText size={18} className="text-[#6C1D5F]" />
          Basic Information
        </h3>
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 mb-1.5" htmlFor="assignment-title">
              Assignment Title <span className="text-rose-500">*</span>
            </label>
            <Input
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-800 placeholder-slate-405 focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] outline-none transition-colors h-10 font-semibold"
              id="assignment-title"
              placeholder="e.g., Final Project: React Architecture"
              type="text"
              value={formData.title}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Type */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 mb-1.5" htmlFor="assignment-type">
                Assignment Type
              </label>
              <Select value={formData.type} onValueChange={(val) => onChange("type", val)}>
                <SelectTrigger className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] outline-none transition-colors h-10 font-semibold">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homework">Homework</SelectItem>
                  <SelectItem value="coding">Coding Assessment</SelectItem>
                  <SelectItem value="pdf">Document Submission (PDF)</SelectItem>
                  <SelectItem value="quiz">Quiz / Exam</SelectItem>
                  <SelectItem value="peer">Peer Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Marks */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 mb-1.5" htmlFor="max-marks">
                Maximum Marks
              </label>
              <Input
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-800 focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] outline-none transition-colors h-10 font-semibold"
                id="max-marks"
                min="0"
                type="number"
                value={formData.maxMarks}
                onChange={(e) => onChange("maxMarks", e.target.value)}
              />
            </div>
          </div>

          {/* Description with formatting toolbar */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 mb-1.5" htmlFor="description">
              Description & Prompt
            </label>
            <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col focus-within:border-[#6C1D5F] transition-colors bg-slate-50/30">
              <FormattingToolbar />
              <textarea
                className="w-full bg-transparent border-none p-4 text-[14px] text-slate-700 focus:ring-0 resize-y min-h-[120px] outline-none"
                id="description"
                placeholder="Provide a brief overview and the main task for this assignment..."
                rows="5"
                value={formData.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 mb-1.5" htmlFor="instructions">
              Specific Instructions (Optional)
            </label>
            <Textarea
              className="w-full bg-slate-50/50 border border-slate-205 rounded-lg px-4 py-2.5 text-[14px] text-slate-800 placeholder-slate-405 focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] outline-none transition-colors resize-y min-h-[80px]"
              id="instructions"
              placeholder="Any specific formatting rules, naming conventions, or resources they should use..."
              rows="3"
              value={formData.instructions}
              onChange={(e) => onChange("instructions", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default AssignmentBasicInfoForm;
