import React from "react";
import AssignmentRow from "./AssignmentRow";

/**
 * Assignment data table for the Manager Dashboard.
 */
const AssignmentTable = React.memo(function AssignmentTable({ assignments, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
        <span className="text-[15px] font-bold text-slate-800">Assignments</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/20 border-b border-slate-100 text-slate-400 text-[11.5px] font-bold uppercase tracking-wider">
              <th className="p-4 font-bold">Title / Course</th>
              <th className="p-4 font-bold">Batch</th>
              <th className="p-4 font-bold">Students</th>
              <th className="p-4 font-bold">Due Date</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px] text-slate-650">
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-450">
                  No assignments found matching these filter settings.
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <AssignmentRow key={a.id} assignment={a} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default AssignmentTable;
