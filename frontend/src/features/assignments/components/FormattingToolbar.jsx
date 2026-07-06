import React from "react";
import { Bold, Italic, Underline, List, ListOrdered, Code } from "lucide-react";

/**
 * Rich text formatting toolbar with bold, italic, underline, list, and code buttons.
 * Used in CreateAssignment description editor.
 */
const FormattingToolbar = React.memo(function FormattingToolbar() {
  return (
    <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
      <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"><Bold size={14} /></button>
      <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"><Italic size={14} /></button>
      <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"><Underline size={14} /></button>
      <div className="w-px h-4 bg-slate-200 mx-1" />
      <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"><List size={14} /></button>
      <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"><ListOrdered size={14} /></button>
      <div className="w-px h-4 bg-slate-200 mx-1" />
      <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"><Code size={14} /></button>
    </div>
  );
});

export default FormattingToolbar;
