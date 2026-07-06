import * as React from "react"
import { cn } from "@/lib/utils"

function Dialog({ open, onOpenChange, children }) {
  React.useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="fixed inset-0" onClick={() => onOpenChange?.(false)} />
      {children}
    </div>
  )
}

function DialogContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl shadow-xl w-full border border-slate-200 flex flex-col animate-scaleUp z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("font-bold text-slate-800 text-sm", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

function DialogFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "p-5 border-t border-slate-150 bg-slate-50 flex gap-3 justify-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
}
