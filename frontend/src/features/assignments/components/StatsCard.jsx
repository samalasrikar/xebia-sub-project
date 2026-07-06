import React from "react";

/**
 * Reusable stat card with label, value, optional subtitle, and accent bar.
 * Used in Gradebook, ManagerDashboard, StudentDashboard.
 *
 * Variants:
 * - "default"  : white card with optional left accent bar
 * - "accent"   : colored background card (e.g. the purple "Next Deadline" card)
 * - "bordered" : white card with left colored border (student dashboard style)
 */
const StatsCard = React.memo(function StatsCard({
  label,
  value,
  subtitle,
  accentColor,
  icon: Icon,
  variant = "default",
  className = "",
}) {
  if (variant === "accent") {
    return (
      <div className={`rounded-xl p-4 border border-transparent shadow-sm flex flex-col justify-between h-[100px] text-white ${className}`}>
        <div className="text-white/70 text-[11px] font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-[15px] font-bold truncate leading-none">{value}</div>
        {subtitle && <div className="text-[11px] text-white/95 font-semibold">{subtitle}</div>}
      </div>
    );
  }

  if (variant === "bordered") {
    return (
      <div className={`bg-white rounded-xl p-5 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow ${className}`}>
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          {Icon && <Icon size={16} className={accentColor ? `text-[${accentColor}]` : "text-slate-400"} style={accentColor ? { color: accentColor } : undefined} />}
        </div>
        <div className="text-[26px] font-black text-slate-850 leading-none">{value}</div>
      </div>
    );
  }

  // default variant
  return (
    <div className={`bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between h-[100px] hover:shadow-md transition-shadow relative overflow-hidden ${className}`}>
      {accentColor && (
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accentColor }} />
      )}
      <div className={`text-slate-450 text-[10px] font-bold uppercase tracking-wider ${accentColor ? "pl-1.5" : ""}`}>
        {label}
      </div>
      <div className={`text-[28px] font-black leading-none ${accentColor ? "pl-1.5" : ""}`} style={subtitle ? undefined : { color: "#1e293b" }}>
        {value}
      </div>
      {subtitle && (
        <div className={`text-[11px] font-semibold ${accentColor ? "pl-1.5" : ""}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
});

export default StatsCard;
