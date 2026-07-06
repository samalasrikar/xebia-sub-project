import React from "react";
import GradeRow from "./GradeRow";

/**
 * Gradebook data table with header and rows.
 * Renders GradeRow components for each filtered submission.
 */
const GradebookTable = React.memo(function GradebookTable({
  submissions,
  onRowClick,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-400 text-[11.5px] font-bold uppercase tracking-wider">
            <th className="py-3 px-5 w-12 text-center">
              <input className="rounded border-slate-300 text-[#6C1D5F] focus:ring-[#6C1D5F]" type="checkbox" />
            </th>
            <th className="py-3 px-4 font-bold">Student</th>
            <th className="py-3 px-4 font-bold">Batch</th>
            <th className="py-3 px-4 font-bold">Assignment</th>
            <th className="py-3 px-4 font-bold text-right">Marks</th>
            <th className="py-3 px-4 font-bold text-center">Grade</th>
            <th className="py-3 px-4 font-bold">Submission Date</th>
            <th className="py-3 px-4 font-bold">Status</th>
            <th className="py-3 px-4 text-center font-bold w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[13px] text-slate-650 divide-y divide-slate-100">
          {submissions.length === 0 ? (
            <tr>
              <td colSpan="9" className="py-8 text-center text-slate-400">
                No matching gradebook records found.
              </td>
            </tr>
          ) : (
            submissions.map((s) => (
              <GradeRow
                key={s.id}
                submission={s}
                onRowClick={() => onRowClick(s)}
                onEdit={() => onEdit(s)}
                onDelete={() => onDelete(s.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

export default GradebookTable;
