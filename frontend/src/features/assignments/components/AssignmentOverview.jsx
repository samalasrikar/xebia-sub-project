import React from "react";
import { FileText } from "lucide-react";

const AssignmentOverview = React.memo(function AssignmentOverview({
  assignment,
  isOverdue,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${isOverdue ? "bg-rose-500" : "bg-[#6C1D5F]"}`}></div>
      <h2 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileText size={18} className="text-[#6C1D5F]" /> Overview
      </h2>
      <div className="text-[13px] text-slate-500 leading-relaxed space-y-4">
        <p>{assignment.description}</p>
        
        {assignment.instructions && (
          <>
            <h3 className="text-slate-800 font-bold text-[13.5px] mt-4 mb-2">Instructions</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 whitespace-pre-line font-medium leading-relaxed">
              {assignment.instructions}
            </div>
          </>
        )}

        <h3 className="text-slate-800 font-bold text-[13.5px] mt-4 mb-2">Submission Rules</h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Format requirements: ZIP, PDF, or DOCX only.</li>
          <li>Maximum file upload size limit: 50MB.</li>
          <li>Verify your code compiles successfully before packaging.</li>
        </ul>
      </div>
    </div>
  );
});

export default AssignmentOverview;
