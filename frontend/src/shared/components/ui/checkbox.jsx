import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-md border border-slate-300 bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#6C1D5F] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#6C1D5F] data-[state=checked]:text-white data-[state=checked]:border-[#6C1D5F] cursor-pointer flex items-center justify-center",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-3 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox }
