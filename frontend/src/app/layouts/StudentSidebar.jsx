import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  HelpCircle
} from "lucide-react";

/* ─── Storage Key ─── */
const STORAGE_KEY = "lms-student-sidebar-collapsed";

/* ─── Menu Configuration ─── */
const MAIN_MENU = [
  { title: "Assignments",  path: "/student/assignments",  icon: ClipboardList },
  { title: "Quizzes",      path: "/student/quizzes",      icon: HelpCircle },
];

const BOTTOM_MENU = [];

/* ─── Tooltip on hover ─── */
function NavTooltip({ label, children }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const [top, setTop] = useState(0);

  const handleEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTop(rect.top + rect.height / 2);
    }
    setShow(true);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="fixed z-[9999] ml-2 -translate-y-1/2 pointer-events-none"
          style={{ left: "72px", top }}
        >
          <div className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            {label}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ─── Collapsed State ─── */
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? false;
    } catch {
      return false;
    }
  });

  /* ─── Mobile overlay state ─── */
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ─── Auto-collapse on small screens ─── */
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1024px)");
    const handler = (e) => {
      if (e.matches) setCollapsed(true);
    };
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  /* ─── Persist to localStorage ─── */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  /* ─── Close mobile drawer on navigation ─── */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/student") return location.pathname === "/student";
    return location.pathname.startsWith(path);
  };

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[250px]";

  /* ─── Shared Link Renderer ─── */
  const renderLink = (item) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    const link = (
      <NavLink
        to={item.path}
        className={`
          group flex items-center gap-3 mx-2 rounded-xl text-[13px] font-medium
          transition-all duration-200 relative overflow-hidden
          ${collapsed ? "justify-center px-0 py-2.5" : "px-3.5 py-2.5"}
          ${active
            ? "bg-[#6C1D5F]/10 text-[#6C1D5F] font-semibold"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }
        `}
      >
        {/* Active left accent */}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#6C1D5F] rounded-r-full" />
        )}

        <Icon
          size={18}
          className={`shrink-0 transition-colors duration-200 ${
            active ? "text-[#6C1D5F]" : "text-slate-400 group-hover:text-slate-600"
          }`}
        />

        {/* Label with fade animation */}
        <span
          className={`whitespace-nowrap transition-all duration-300 ${
            collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
          }`}
        >
          {item.title}
        </span>
      </NavLink>
    );

    /* Show tooltip only when collapsed */
    return collapsed ? (
      <NavTooltip key={item.path} label={item.title}>
        {link}
      </NavTooltip>
    ) : (
      <div key={item.path}>{link}</div>
    );
  };

  /* ─── Sidebar Content (shared between desktop and mobile) ─── */
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Logo / Branding ── */}
      <div className={`flex items-center gap-3 border-b border-slate-200/80 shrink-0 transition-all duration-300 ${collapsed ? "px-0 justify-center py-4" : "px-5 py-[18px]"}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C1D5F] to-[#84117C] flex items-center justify-center shrink-0 shadow-sm shadow-[#6C1D5F]/20">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div className={`transition-all duration-300 overflow-hidden ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
          <div className="text-[14px] font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">Xebia LMS</div>
          <div className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase mt-1 whitespace-nowrap">Student Portal</div>
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
        {MAIN_MENU.map(renderLink)}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="shrink-0 border-t border-slate-200/80">
        {/* Bottom nav items */}
        <div className="py-2 space-y-0.5">
          {BOTTOM_MENU.map(renderLink)}
        </div>

        {/* Trainer switch */}
        <div className={`border-t border-slate-200/80 px-2 py-3 ${collapsed ? "flex justify-center" : ""}`}>
          {collapsed ? (
            <NavTooltip label="Back to Trainer">
              <button
                onClick={() => navigate("/")}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer border-none outline-none"
              >
                <ArrowLeft size={16} />
              </button>
            </NavTooltip>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer border-none outline-none"
            >
              <ArrowLeft size={15} className="shrink-0" />
              <span>Back to Trainer</span>
            </button>
          )}
        </div>

        {/* Toggle button */}
        <div className={`border-t border-slate-200/80 py-2.5 ${collapsed ? "flex justify-center" : "px-2"}`}>
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className={`
              flex items-center gap-2 rounded-xl text-[12px] font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-600
              transition-all cursor-pointer border-none outline-none
              ${collapsed ? "w-9 h-9 justify-center" : "w-full px-3.5 py-2"}
            `}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
              Collapse
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-white border-r border-slate-200/80
          flex-col z-40 transition-all duration-300 ease-in-out
          hidden md:flex shadow-[1px_0_3px_rgba(0,0,0,0.02)]
          ${sidebarWidth}
        `}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Hamburger Button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
        aria-label="Open navigation"
      >
        <PanelLeftOpen size={18} />
      </button>

      {/* ── Mobile Overlay + Drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 h-screen w-[250px] bg-white border-r border-slate-200 z-50 shadow-2xl animate-slide-in">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
