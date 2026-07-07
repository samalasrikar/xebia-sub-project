import React from "react";
import GradeRow from "./GradeRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

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
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="border-b border-slate-100 bg-slate-50/20 hover:bg-slate-50/20">
            <TableHead className="py-3 px-5 w-12 text-center h-10">
              <input className="rounded border-slate-300 text-[#6C1D5F] focus:ring-[#6C1D5F]" type="checkbox" />
            </TableHead>
            <TableHead className="py-3 px-4 font-bold h-10">Student</TableHead>
            <TableHead className="py-3 px-4 font-bold h-10">Batch</TableHead>
            <TableHead className="py-3 px-4 font-bold h-10">Assignment</TableHead>
            <TableHead className="py-3 px-4 font-bold text-right h-10">Marks</TableHead>
            <TableHead className="py-3 px-4 font-bold text-center h-10">Grade</TableHead>
            <TableHead className="py-3 px-4 font-bold h-10">Submission Date</TableHead>
            <TableHead className="py-3 px-4 font-bold h-10">Status</TableHead>
            <TableHead className="py-3 px-4 text-center font-bold w-24 h-10">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[13px] text-slate-650 divide-y divide-slate-100">
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-8 text-center text-slate-400">
                No matching gradebook records found.
              </TableCell>
            </TableRow>
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
        </TableBody>
      </Table>
    </div>
  );
});

export default GradebookTable;
