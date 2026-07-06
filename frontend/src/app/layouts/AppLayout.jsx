import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const location = useLocation();
  const isAnalytics = location.pathname.startsWith("/analytics");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {!isAnalytics && (
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      )}

      <div className={`${!isAnalytics ? "md:ml-[220px]" : ""} flex flex-col flex-1 min-w-0`}>

        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className={isAnalytics ? "flex-1 flex overflow-hidden" : "flex-1 overflow-y-auto p-4 md:p-7 xl:p-8"}>
          {children}
        </main>

      </div>

    </div>
  );
}