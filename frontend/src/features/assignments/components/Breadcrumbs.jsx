import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Reusable breadcrumb navigation for student pages.
 * Used in StudentAssignmentDetails, StudentMySubmissions, StudentAssignmentResult.
 *
 * @param {Array} items - Array of { label, to } objects. Last item is the current page (no link).
 */
const Breadcrumbs = React.memo(function Breadcrumbs({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={12} className="text-slate-300" />}
            {isLast ? (
              <span className="text-slate-800 font-extrabold">{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:text-[#6C1D5F] transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

export default Breadcrumbs;
