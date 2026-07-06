import * as React from "react"
import { cn } from "@/lib/utils"

function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        "text-xs font-semibold text-slate-500 leading-none select-none",
        className
      )}
      {...props}
    />
  )
}

export { Label }
