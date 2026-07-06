import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6C1D5F] focus:border-[#6C1D5F] transition-all resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
