import React from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

/**
 * Reusable file card row for displaying file attachments with download/link action.
 * Used in StudentAssignmentDetails, StudentAssignmentResult, SubmissionReview, CreateAssignment.
 */
const FileCard = React.memo(function FileCard({
  name,
  size,
  type,
  onClick,
  onRemove,
  variant = "default", // "default" | "compact"
}) {
  const isLink = type === "link";

  if (variant === "compact") {
    // Compact version used in uploaded files lists
    return (
      <Card className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200/80 text-[12.5px] shadow-none">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <FileText size={14} className="text-[#6C1D5F] shrink-0" />
          <span className="truncate font-semibold text-slate-700">{name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {size && <span className="text-[10.5px] text-slate-400">{size}</span>}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-slate-400 hover:text-rose-500 p-0.5 hover:bg-rose-50 rounded transition-colors cursor-pointer"
            >
              <span className="sr-only">Remove</span>
              ×
            </button>
          )}
        </div>
      </Card>
    );
  }

  // Default variant — clickable card with icon + name + size + action
  return (
    <Card className="hover:border-[#6C1D5F]/30 hover:bg-slate-50/50 transition-colors group cursor-pointer border-slate-100 shadow-none">
      <CardContent className="p-3.5 flex items-center w-full">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onClick?.(); }}
          className="flex items-center w-full"
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mr-4 ${
            isLink
              ? "bg-[#01AC9F]/10 text-[#01AC9F]"
              : "bg-rose-50 text-rose-600"
          }`}>
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-slate-700 truncate group-hover:text-[#6C1D5F] transition-colors">
              {name}
            </div>
            {size && <div className="text-[11px] text-slate-400 font-medium mt-0.5">{size}</div>}
          </div>
          <span className="text-slate-400 group-hover:text-[#6C1D5F] transition-colors">
            {isLink ? <ExternalLink size={16} /> : <Download size={16} />}
          </span>
        </a>
      </CardContent>
    </Card>
  );
});

export default FileCard;
