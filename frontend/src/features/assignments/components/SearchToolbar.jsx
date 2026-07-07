import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

/**
 * Reusable search + filter toolbar.
 * Used in Gradebook and ManagerDashboard filter toolbars.
 */
const SearchToolbar = React.memo(function SearchToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  children, // filter selects, buttons etc.
  className = "",
}) {
  return (
    <div className={`p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 items-center bg-slate-50/50 ${className}`}>
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={14} />
        <Input
          className="w-full pl-9 pr-4 bg-white border border-slate-200 rounded-lg text-[13px] placeholder-slate-400 focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] outline-none transition-all h-8"
          placeholder={searchPlaceholder}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {children && (
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {children}
        </div>
      )}
    </div>
  );
});

export default SearchToolbar;
