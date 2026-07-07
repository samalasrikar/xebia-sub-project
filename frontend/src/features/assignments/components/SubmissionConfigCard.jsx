import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

/**
 * Submission configuration card for CreateAssignment.
 * Contains allowed formats checkboxes and max upload size selector.
 */
const SubmissionConfigCard = React.memo(function SubmissionConfigCard({ formData, onChange, onFormatToggle }) {
  const formats = [
    "File Upload (PDF, DOCX)",
    "Images (JPG, PNG)",
    "Code Repository Link (GitHub)",
    "Rich Text Entry (Inline)",
  ];

  return (
    <Card className="bg-white rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-[15px] font-bold text-slate-800 mb-5 flex items-center gap-2">
          <SettingsIcon size={18} className="text-slate-500" />
          Submission Config
        </h3>
        <div className="space-y-4">
          {/* Allowed Formats */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 mb-2.5">Allowed Formats</label>
            <div className="space-y-2.5">
              {formats.map(format => (
                <label key={format} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={formData.allowedFormats.includes(format)}
                    onCheckedChange={() => onFormatToggle(format)}
                    className="w-4 h-4 text-[#6C1D5F] rounded border-slate-350 focus:ring-[#6C1D5F]"
                  />
                  <span className="text-[13px] text-slate-650 group-hover:text-[#6C1D5F] transition-colors">{format}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Upload Size */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 mb-1.5" htmlFor="max-size">
              Max Upload Size per File
            </label>
            <Select value={formData.maxUploadSize} onValueChange={(val) => onChange("maxUploadSize", val)}>
              <SelectTrigger className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-750 focus:border-[#6C1D5F] outline-none transition-colors h-9 font-semibold">
                <SelectValue placeholder="Select max size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 MB</SelectItem>
                <SelectItem value="25">25 MB</SelectItem>
                <SelectItem value="50">50 MB</SelectItem>
                <SelectItem value="100">100 MB</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default SubmissionConfigCard;
