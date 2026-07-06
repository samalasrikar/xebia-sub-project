import React from "react";
import { UploadCloud, FileText, Trash2, Link as LinkIcon, Video } from "lucide-react";

/**
 * Resource attachments card for CreateAssignment.
 * Includes dropzone, uploaded files list, and alternate link buttons.
 */
const ResourceAttachments = React.memo(function ResourceAttachments({
  attachments,
  onFileUpload,
  onRemoveAttachment,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#01AC9F]" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <UploadCloud size={18} className="text-[#01AC9F]" />
          Resource Attachments
        </h3>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">Optional</span>
      </div>
      <p className="text-[13px] text-slate-400 mb-4">Provide templates, reading materials, or reference links for students.</p>

      {/* Dropzone */}
      <label className="border-2 border-dashed border-slate-200 hover:border-[#6C1D5F]/60 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/30 hover:bg-slate-50/70 transition-colors cursor-pointer group mb-4">
        <input type="file" multiple className="hidden" onChange={onFileUpload} />
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud size={20} className="text-[#6C1D5F]" />
        </div>
        <p className="text-[14px] text-slate-700 font-semibold mb-0.5">Click to upload or drag and drop</p>
        <p className="text-[12px] text-slate-400">PDF, DOCX, JPG, PNG or ZIP (Max 50MB)</p>
      </label>

      {/* Uploaded Attachments */}
      {attachments.length > 0 && (
        <div className="space-y-2 mb-4">
          {attachments.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-[#6C1D5F]" />
                <div>
                  <p className="text-[13px] font-semibold text-slate-700">{file.name}</p>
                  <p className="text-[11px] text-slate-400">{file.size}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveAttachment(idx)}
                className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Alternate Links */}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 bg-white text-slate-750 text-[13px] font-medium transition-colors">
          <LinkIcon size={14} className="text-slate-400" />
          Add External Link
        </button>
        <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 bg-white text-slate-750 text-[13px] font-medium transition-colors">
          <Video size={14} className="text-rose-500" />
          Add Video URL
        </button>
      </div>
    </div>
  );
});

export default ResourceAttachments;
