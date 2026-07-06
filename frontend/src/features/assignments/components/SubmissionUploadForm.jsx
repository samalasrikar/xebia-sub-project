import React from "react";
import { UploadCloud } from "lucide-react";
import FileCard from "./FileCard";

const SubmissionUploadForm = React.memo(function SubmissionUploadForm({
  dragActive,
  uploadedFiles,
  notes,
  onNotesChange,
  onDrag,
  onDrop,
  onFileChange,
  onRemoveFile,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col flex-1">
      <h2 className="text-[15px] font-bold text-slate-800 mb-4">Your Submission</h2>
      
      {/* Drag Zone */}
      <div
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onDrag}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative bg-slate-50/20 hover:bg-slate-50/70 ${
          dragActive ? "border-[#6C1D5F] bg-[#6C1D5F]/5" : "border-slate-200"
        }`}
      >
        <input
          type="file"
          multiple
          id="file-upload"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <UploadCloud size={28} className="text-[#6C1D5F] mb-2" />
        <p className="text-[13px] font-bold text-slate-700 mb-0.5">Drag & drop files here</p>
        <p className="text-[11px] text-slate-400">or click to browse from disk</p>
        <p className="text-[9.5px] text-slate-400 mt-3 font-semibold">ZIP, PDF or DOCX (Max 50MB)</p>
      </div>

      {/* Uploaded Files Previews */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Attached Files</h4>
          <div className="space-y-1.5">
            {uploadedFiles.map((file, index) => (
              <FileCard
                key={index}
                name={file.name}
                size={file.size}
                variant="compact"
                onRemove={() => onRemoveFile(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Notes Textarea */}
      <div className="mt-4 flex-1 flex flex-col">
        <label className="block text-[12px] font-semibold text-slate-500 mb-1.5" htmlFor="notes">
          Submission Notes (Optional)
        </label>
        <textarea
          id="notes"
          className="w-full rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 placeholder-slate-400 p-3 focus:border-[#6C1D5F] outline-none transition-colors resize-none flex-1 min-h-[90px]"
          placeholder="Add any comments or explanations for the instructor..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="py-1.5 rounded-lg border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold text-[12.5px] transition-colors text-center cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="py-1.5 rounded-lg bg-[#6C1D5F] hover:bg-[#4A1E47] text-white font-bold text-[12.5px] transition-colors text-center cursor-pointer shadow-sm shadow-[#6C1D5F]/10"
        >
          Submit
        </button>
      </div>
    </div>
  );
});

export default SubmissionUploadForm;
