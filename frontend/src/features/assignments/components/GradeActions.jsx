import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

/**
 * Icon-only action buttons for Gradebook table rows.
 * Edit Grade navigates to the submission review page.
 * Delete Record triggers a DeleteDialog confirmation.
 */
const GradeActions = React.memo(function GradeActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-8 w-8 text-slate-500 hover:text-[#6C1D5F] hover:bg-slate-100/80"
        title="Edit Grade"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50"
        title="Delete Record"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});

export default GradeActions;
