import React from "react";

/**
 * Reusable initials-avatar cell for tables and lists.
 * Used in Gradebook rows and SubmissionReview student list.
 */
const StudentAvatarCell = React.memo(function StudentAvatarCell({
  name,
  size = "default", // "default" (w-8 h-8) | "sm" (w-9 h-9)
}) {
  const initials = (name || "Anonymous")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("");

  const sizeClasses = size === "sm"
    ? "w-9 h-9"
    : "w-8 h-8";

  return (
    <div className={`${sizeClasses} rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#6C1D5F] shrink-0 border border-slate-200`}>
      {initials}
    </div>
  );
});

export default StudentAvatarCell;
