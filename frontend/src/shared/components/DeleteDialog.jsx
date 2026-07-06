import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

export default function DeleteDialog({
  show,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  deleting,
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-[420px] rounded-xl shadow-xl bg-white border border-slate-200 p-6">
        
        {/* Header */}
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-bold text-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="flex flex-col text-left">
              <span className="leading-tight">{title}</span>
              <span className="text-[12px] text-slate-500 font-medium mt-1 normal-case leading-relaxed">
                {message}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Item name highlight */}
        {itemName && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 animate-fadeIn">
            <p className="text-[11px] font-bold text-red-700/70 uppercase tracking-wider">Item Selected:</p>
            <p className="text-[13px] font-bold text-slate-800 mt-0.5">{itemName}</p>
          </div>
        )}

        {/* Footer Buttons */}
        <DialogFooter className="pt-4 border-t border-slate-50 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={deleting}
            className="text-[12.5px] font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white text-[12.5px] font-semibold px-6 shadow-sm shadow-red-500/10"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
