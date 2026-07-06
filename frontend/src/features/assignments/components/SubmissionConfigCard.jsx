import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

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
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
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
                <input
                  checked={formData.allowedFormats.includes(format)}
                  onChange={() => onFormatToggle(format)}
                  type="checkbox"
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
          <select
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:border-[#6C1D5F] outline-none transition-colors"
            id="max-size"
            value={formData.maxUploadSize}
            onChange={(e) => onChange("maxUploadSize", e.target.value)}
          >
            <option value="10">10 MB</option>
            <option value="25">25 MB</option>
            <option value="50">50 MB</option>
            <option value="100">100 MB</option>
          </select>
        </div>
      </div>
    </div>
  );
});

export default SubmissionConfigCard;
