import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentTopbar from "./StudentTopbar";

const STORAGE_KEY = "lms-student-sidebar-collapsed";

export default function StudentLayout() {
  /* Read sidebar collapsed state to sync margin */
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? false;
    } catch {
      return false;
    }
  });

  /* Sync state from localStorage changes (sidebar toggles write there) */
  useEffect(() => {
    const onStorage = () => {
      try {
        setCollapsed(JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? false);
      } catch { /* ignore */ }
    };

    /* Poll localStorage since same-tab writes don't fire 'storage' event */
    const interval = setInterval(onStorage, 150);
    return () => clearInterval(interval);
  }, []);

  const marginLeft = collapsed ? "md:ml-[72px]" : "md:ml-[250px]";

  return (
    <div className="min-h-screen bg-slate-50/80 flex">
      <StudentSidebar />

      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${marginLeft}`}
      >
        <StudentTopbar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
