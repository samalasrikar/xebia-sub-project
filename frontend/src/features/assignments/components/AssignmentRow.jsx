import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { Eye, Edit2, Trash2 } from "lucide-react";

/**
 * Single row in the Assignment table on the Manager Dashboard.
 */
const AssignmentRow = React.memo(function AssignmentRow({ assignment, onDelete }) {
  const navigate = useNavigate();
  const a = assignment;

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-8 rounded-full ${a.status === "Active" ? "bg-[#6C1D5F]" : a.status === "Completed" ? "bg-emerald-500" : "bg-slate-300"}`} />
          <div>
            <div
              onClick={() => navigate(`/trainer/assignments/edit/${a.id}`)}
              className="text-[14px] font-bold text-slate-800 group-hover:text-[#6C1D5F] transition-colors cursor-pointer"
            >
              {a.title}
            </div>
            <div className="text-[12px] text-slate-400 mt-0.5">{a.course}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-slate-700">{a.batch}</td>
      <td className="p-4 text-slate-700">
        {a.scope === "Entire Course" ? "Entire Batch" : "12 Students"}
      </td>
      <td className="p-4 text-slate-700">{a.dueDate}</td>
      <td className="p-4">
        <StatusBadge status={a.status} />
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigate("/trainer/gradebook")}
            className="text-slate-400 hover:text-[#6C1D5F] p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="View Submissions"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => navigate(`/trainer/assignments/edit/${a.id}`)}
            className="text-slate-400 hover:text-[#6C1D5F] p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(a.id)}
            className="text-slate-400 hover:text-rose-500 p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
});

export default AssignmentRow;
