import React from "react";

const AssignmentMetadataCard = React.memo(function AssignmentMetadataCard({
  assignment,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 shrink-0">
      <h3 className="text-[14px] font-bold text-slate-850 border-b border-slate-100 pb-2">Details</h3>
      <div className="space-y-3.5 text-[12.5px]">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Max Marks</span>
          <span className="font-extrabold text-slate-800 text-[15px]">{assignment.maxMarks}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Weightage</span>
          <span className="font-semibold text-slate-750">{assignment.weightage}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Attempts Allowed</span>
          <span className="font-semibold text-slate-750">{assignment.attemptsAllowed}</span>
        </div>
      </div>
    </div>
  );
});

export default AssignmentMetadataCard;
