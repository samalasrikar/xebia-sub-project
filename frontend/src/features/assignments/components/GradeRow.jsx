import React from "react";
import StudentAvatarCell from "./StudentAvatarCell";
import StatusBadge from "./StatusBadge";
import GradeActions from "./GradeActions";
import { TableRow, TableCell } from "@/shared/components/ui/table";

/**
 * Single row in the Gradebook table.
 */
function getGradeLetter(score) {
  if (score === null || score === undefined) return "-";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const GradeRow = React.memo(function GradeRow({ submission, onRowClick, onEdit, onDelete }) {
  const s = submission;
  const isSubmitted = s.status === "Submitted" || s.status === "Pending";
  const isLate = s.submittedAt && s.submittedAt.toLowerCase().includes("late");
  const gradeLetter = getGradeLetter(s.score);

  return (
    <TableRow
      className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-b border-slate-100"
      onClick={onRowClick}
    >
      <TableCell className="py-3 px-5 text-center" onClick={(e) => e.stopPropagation()}>
        <input className="rounded border-slate-300 text-[#6C1D5F] focus:ring-[#6C1D5F]" type="checkbox" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="flex items-center gap-3">
          <StudentAvatarCell name={s.studentName} />
          <div className="font-semibold text-slate-800">{s.studentName}</div>
        </div>
      </TableCell>
      <TableCell className="py-3 px-4 text-slate-400">{s.batch}</TableCell>
      <TableCell className="py-3 px-4 font-medium text-slate-700 truncate max-w-[200px]">{s.assignmentTitle}</TableCell>
      <TableCell className="py-3 px-4 text-right font-bold text-slate-700">
        {s.score !== null ? `${s.score}/100` : "--/100"}
      </TableCell>
      <TableCell className="py-3 px-4 text-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 font-bold text-xs text-slate-700">
          {gradeLetter}
        </span>
      </TableCell>
      <TableCell className={`py-3 px-4 ${isLate ? "text-rose-500 font-medium" : "text-slate-400"}`}>
        {s.submittedAt || "Not Submitted"}
      </TableCell>
      <TableCell className="py-3 px-4">
        <StatusBadge status={s.status} />
      </TableCell>
      <TableCell className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
        <GradeActions onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
});

export default GradeRow;
