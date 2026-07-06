import React from "react";

/**
 * Reusable page header with title, subtitle, and optional action button.
 * Used in Gradebook, ManagerDashboard, StudentDashboard, CreateAssignment.
 */
const PageHeader = React.memo(function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-[21px] font-bold text-slate-900 tracking-tight leading-snug">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
});

export default PageHeader;
