import React from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Reusable EmptyState component to display "No Data", "No Results", or similar states.
 * Follows premium, responsive design rules.
 *
 * @param {object} props
 * @param {React.ComponentType} [props.icon] - Lucide icon component to show
 * @param {string} props.title - Title text
 * @param {React.ReactNode} [props.description] - Description text or element
 * @param {object} [props.primaryAction] - { label, onClick, variant, className, disabled }
 * @param {object} [props.secondaryAction] - { label, onClick, variant, className, disabled }
 * @param {React.ReactNode} [props.illustration] - Custom graphic to render instead of or in addition to icon
 * @param {"sm" | "lg"} [props.size="lg"] - Controls scale and layout padding (compact vs. full card)
 * @param {string} [props.className] - Custom wrapper classes
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration,
  size = "lg",
  className,
}) {
  const isCompact = size === "sm";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center animate-[scaleUp_0.15s_ease-out_both] w-full",
        isCompact
          ? "py-8 px-4"
          : "bg-gradient-to-b from-white to-slate-50/30 border border-slate-200 rounded-2xl p-8 md:p-16 shadow-sm sm:min-w-[400px] sm:max-w-[550px] mx-auto my-6",
        className
      )}
    >
      {/* Illustration or Icon */}
      {illustration ? (
        <div className={cn("mb-5 flex justify-center", isCompact ? "w-10 h-10" : "w-20 h-20")}>
          {illustration}
        </div>
      ) : (
        Icon && (
          <div
            className={cn(
              "rounded-2xl bg-[#6C1D5F]/5 text-[#6C1D5F] flex items-center justify-center border border-[#6C1D5F]/10 shadow-inner transition-transform duration-300 hover:scale-105",
              isCompact ? "w-11 h-11 mb-3 rounded-xl" : "w-16 h-16 mb-6"
            )}
          >
            <Icon size={isCompact ? 20 : 28} className="stroke-[1.75]" />
          </div>
        )
      )}

      {/* Title */}
      <h3
        className={cn(
          "font-bold text-slate-800 tracking-tight",
          isCompact ? "text-[13.5px] mb-1" : "text-lg mb-2"
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "text-slate-500 leading-relaxed font-medium mx-auto",
            isCompact ? "text-[11.5px] max-w-[240px]" : "text-[13px] max-w-[380px] mb-6"
          )}
        >
          {description}
        </p>
      )}

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div
          className={cn(
            "flex items-center justify-center gap-3 w-full",
            isCompact ? "mt-3" : "mt-2",
            // Stack buttons on small screens, row on desktop
            isCompact ? "flex-col" : "flex-col sm:flex-row sm:w-auto"
          )}
        >
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "outline"}
              size={isCompact ? "sm" : "lg"}
              disabled={secondaryAction.disabled}
              onClick={secondaryAction.onClick}
              className={cn(
                "font-semibold transition-all h-9 text-xs sm:h-10 sm:text-[13px] rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm w-full sm:w-auto",
                secondaryAction.className
              )}
            >
              {secondaryAction.label}
            </Button>
          )}

          {primaryAction && (
            <Button
              variant={primaryAction.variant || "default"}
              size={isCompact ? "sm" : "lg"}
              disabled={primaryAction.disabled}
              onClick={primaryAction.onClick}
              className={cn(
                "font-bold transition-all h-9 text-xs sm:h-10 sm:text-[13px] rounded-lg shadow-sm bg-[#6C1D5F] hover:bg-[#521347] text-white w-full sm:w-auto",
                primaryAction.className
              )}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
