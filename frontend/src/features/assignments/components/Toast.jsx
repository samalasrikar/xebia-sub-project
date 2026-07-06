import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

/**
 * Shared toast notification used across Assignment pages.
 * Auto-dismisses after 3 seconds.
 */
const Toast = React.memo(function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl animate-fadeIn">
      <CheckCircle size={18} className="text-[#01AC9F] flex-shrink-0" />
      <span className="text-[13px] font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
});

export default Toast;
