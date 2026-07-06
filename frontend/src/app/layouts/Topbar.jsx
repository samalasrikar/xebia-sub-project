import { Bell, Search, HelpCircle, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import adminProfileIcon from "../../assets/admin_profile_icon.svg";

const PATH_LABELS = {
  "/trainer/assignments": "Assignments",
  "/trainer/gradebook": "Gradebook",
};

function getBreadcrumb(pathname) {
  // Match exact or prefix
  const label = Object.entries(PATH_LABELS).find(([key]) =>
    key !== "/trainer" ? pathname.startsWith(key) : pathname === "/trainer"
  );
  return label ? label[1] : "Page";
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const pageLabel = getBreadcrumb(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8 flex-shrink-0">

      {/* ── Left: Breadcrumb ─────────────────────── */}
      <div className="flex items-center gap-1.5 text-[13px]">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 mr-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Menu size={14} />
        </button>
        <span className="text-slate-400 font-medium hidden sm:inline">Xebia LMS</span>
        <span className="text-slate-350 hidden sm:inline">/</span>
        <span className="text-slate-900 font-semibold">{pageLabel}</span>
      </div>

      {/* ── Right: Actions ───────────────────────── */}
      <div className="flex items-center gap-1.5">

        {/* Autosave pill */}
        <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-medium px-2.5 py-1 rounded-full border border-slate-200 bg-white">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          All changes saved
        </div>

        <div className="w-px h-[18px] bg-slate-200 mx-0.5" />

        {/* Search btn */}
        <button className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <Search size={14} />
        </button>

        {/* Bell btn */}
        <button className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border-[1.5px] border-white" />
        </button>

        {/* Help btn */}
        <button className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <HelpCircle size={14} />
        </button>

        {/* Avatar */}
        <img
          src={adminProfileIcon}
          alt="Trainer"
          loading="lazy"
          className="w-[30px] h-[30px] rounded-full object-cover border-2 border-slate-200 ml-1 cursor-pointer"
        />
      </div>
    </header>
  );
}
