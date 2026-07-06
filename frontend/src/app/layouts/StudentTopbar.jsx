import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Bell,
  Search,
  Calendar,
  Mail,
  User,
  Settings,
  BookOpen,
  HelpCircle,
  LogOut,
  ChevronDown,
  ClipboardList,
  Megaphone,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

/* ── Route metadata ──────────────────────────────────────────────── */
const PATH_METADATA = {
  "/student": {
    title: "Dashboard",
    breadcrumb: "Dashboard",
    description: "Your academic progress at a glance.",
  },
  "/student/courses": {
    title: "My Courses",
    breadcrumb: "Courses",
    description: "Enrolled classes and modules.",
  },
  "/student/calendar": {
    title: "Calendar",
    breadcrumb: "Calendar",
    description: "Deadlines, sessions, and events.",
  },
  "/student/assignments": {
    title: "Assignments",
    breadcrumb: "Assignments",
    description: "Pending, graded, and submitted work.",
  },
  "/student/grades": {
    title: "Academic Record",
    breadcrumb: "Grades",
    description: "Grades, transcripts, and certificates.",
  },
  "/student/analytics": {
    title: "Analytics",
    breadcrumb: "Analytics",
    description: "Study metrics and performance insights.",
  },
  "/student/downloads": {
    title: "Downloads",
    breadcrumb: "Downloads",
    description: "Study guides, templates, and resources.",
  },
  "/student/assistant": {
    title: "AI Assistant",
    breadcrumb: "AI Assistant",
    description: "Instant academic help from your AI tutor.",
  },
  "/student/notifications": {
    title: "Notifications",
    breadcrumb: "Notifications",
    description: "Grades, deadlines, and announcements.",
  },
  "/student/profile": {
    title: "Profile",
    breadcrumb: "Profile",
    description: "Personal and academic information.",
  },
  "/student/settings": {
    title: "Settings",
    breadcrumb: "Settings",
    description: "Notification, security, and preferences.",
  },
};

/* ── Mock notifications (API-ready structure) ────────────────────── */
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "reminder",
    title: "Assignment Due Tomorrow",
    description: "Advanced Data Structures — Final project due at 11:59 PM.",
    time: "2h ago",
    read: false,
    icon: ClipboardList,
    color: "text-[#6C1D5F]",
    bg: "bg-[#6C1D5F]/10",
  },
  {
    id: 2,
    type: "system",
    title: "New Grade Posted",
    description: "Data Visualization — Score: A (94%)",
    time: "5h ago",
    read: false,
    icon: Megaphone,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: 3,
    type: "community",
    title: "Discussion Reply",
    description: 'Sarah Jenkins replied to your post in "Ethical AI".',
    time: "Yesterday",
    read: true,
    icon: MessageSquare,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export default function StudentTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [notifications] = useState(MOCK_NOTIFICATIONS);

  /* ── Resolve current page metadata ── */
  const currentPath =
    location.pathname.endsWith("/") && location.pathname !== "/student/"
      ? location.pathname.slice(0, -1)
      : location.pathname;

  const resolveMeta = (path) => {
    // Exact match first
    if (PATH_METADATA[path]) return PATH_METADATA[path];

    // Dynamic route patterns
    if (/^\/student\/courses\/[^/]+\/modules\/[^/]+\/lessons\/[^/]+$/.test(path)) {
      return { title: "Lesson", breadcrumb: "Courses / Lesson", description: "Lesson content and resources." };
    }
    if (/^\/student\/courses\/[^/]+\/modules\/[^/]+$/.test(path)) {
      return { title: "Module", breadcrumb: "Courses / Module", description: "Module details and lessons." };
    }
    if (/^\/student\/courses\/[^/]+\/completed$/.test(path)) {
      return { title: "Course Completed", breadcrumb: "Courses / Completed", description: "Congratulations on finishing!" };
    }
    if (/^\/student\/courses\/[^/]+$/.test(path)) {
      return { title: "Course Overview", breadcrumb: "Courses / Overview", description: "Course details and curriculum." };
    }

    return { title: "Student Portal", breadcrumb: "Home", description: "" };
  };

  const meta = resolveMeta(currentPath);

  /* ── Scroll shadow ── */
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const handler = () => setScrolled(main.scrollTop > 2);
    main.addEventListener("scroll", handler, { passive: true });
    return () => main.removeEventListener("scroll", handler);
  }, []);

  /* ── Keyboard shortcut: Ctrl/Cmd + K → focus search ── */
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.userAgent);

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 items-center border-b bg-white px-4 md:px-6 flex-shrink-0 transition-shadow duration-200 ${
        scrolled
          ? "border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]"
          : "border-slate-200/80"
      }`}
    >
      {/* ── Left: Breadcrumb + Title ──────────────────────────── */}
      <div className="flex flex-col min-w-0 shrink-0 mr-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 leading-none">
          <span>Student Portal</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#6C1D5F] font-semibold truncate">
            {meta.breadcrumb}
          </span>
        </div>
        {/* Title + description */}
        <div className="flex items-baseline gap-2 mt-0.5">
          <h1 className="text-[15px] font-bold text-slate-800 leading-tight truncate">
            {meta.title}
          </h1>
          {meta.description && (
            <span className="hidden xl:inline text-[11px] text-slate-400 font-medium border-l border-slate-200 pl-2 truncate">
              {meta.description}
            </span>
          )}
        </div>
      </div>

      {/* ── Center: Global Search ─────────────────────────────── */}
      <div className="hidden md:flex flex-1 max-w-md mx-auto relative">
        <div
          className={`w-full flex items-center gap-2 rounded-lg border px-3 h-8 transition-all duration-150 ${
            searchFocused
              ? "border-[#6C1D5F]/40 ring-2 ring-[#6C1D5F]/8 bg-white"
              : "border-slate-200 bg-slate-50/80 hover:bg-slate-100/60 hover:border-slate-300"
          }`}
        >
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            ref={searchRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search courses, assignments, resources..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-700 placeholder:text-slate-400 p-0"
          />
          {!searchFocused && (
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 leading-none">
              {isMac ? "⌘" : "Ctrl"}
              <span className="text-[9px]">K</span>
            </kbd>
          )}
        </div>
      </div>

      {/* ── Right: Actions ────────────────────────────────────── */}
      <div className="flex items-center gap-1 ml-auto shrink-0">
        {/* Mobile search toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden text-slate-500"
          aria-label="Search"
        >
          <Search size={16} />
        </Button>

        {/* Calendar shortcut */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-slate-500 hover:text-slate-700"
          asChild
        >
          <Link to="/student/calendar" title="Calendar">
            <Calendar size={16} />
          </Link>
        </Button>

        {/* Messages/Inbox */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-slate-500 hover:text-slate-700 relative"
          asChild
        >
          <Link to="/student/assistant" title="Messages">
            <Mail size={16} />
          </Link>
        </Button>

        {/* ── Notifications dropdown ── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-slate-500 hover:text-slate-700 relative"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6C1D5F]/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6C1D5F]" />
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-0 rounded-xl shadow-lg border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-[13px] font-semibold text-slate-800">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] h-5 bg-[#6C1D5F]/10 text-[#6C1D5F] font-semibold"
                >
                  {unreadCount} new
                </Badge>
              )}
            </div>

            {/* Notification list */}
            <ScrollArea className="max-h-72">
              <div className="py-1">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.id}
                      className={`w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? "bg-[#6C1D5F]/[0.02]" : ""
                      }`}
                      onClick={() => navigate("/student/notifications")}
                    >
                      <div
                        className={`shrink-0 w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center mt-0.5`}
                      >
                        <Icon size={14} className={n.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C1D5F] shrink-0" />
                          )}
                          <span className="text-[12.5px] font-semibold text-slate-700 truncate">
                            {n.title}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-500 mt-0.5 line-clamp-1">
                          {n.description}
                        </p>
                        <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                          {n.time}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-slate-100 px-4 py-2.5">
              <Link
                to="/student/notifications"
                className="flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#6C1D5F] hover:text-[#84117C] transition-colors"
              >
                View All Notifications
                <ExternalLink size={11} />
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Separator */}
        <Separator
          orientation="vertical"
          className="hidden sm:block h-6 mx-1"
        />

        {/* ── Profile dropdown ── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-slate-50 transition-colors cursor-pointer outline-none select-none border-none bg-transparent">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsyA0vivV0CljyXSlO3SYa2Gmz4zhiGm-b2jr6sz5y0X9zQ-2QYxVIQhFznZswh2oWy6CWbcilrt8DuhXIY0hoZEOwfoLXSXKJq52lwOp6TKpxMxvu5i3PCQBHmpCcMEo0bLB2uhWCNxh2gzo_NV6W4SMp5KSErR1EIEyk4e4ofvihdR7bax6PuGE-LHAsxwQQukHG1AU3DzIR_ILy3eVATJfuedxBS0V9ieM5lajis6SdRBJVU5kxbTcn5VlGWjqCkr786KglsMs"
                  alt="Alex Johnson"
                />
                <AvatarFallback className="text-xs bg-[#6C1D5F] text-white">
                  AJ
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-[12.5px] font-semibold text-slate-700">
                  Alex Johnson
                </span>
                <span className="text-[10.5px] text-slate-400 font-medium">
                  Student
                </span>
              </div>
              <ChevronDown
                size={12}
                className="text-slate-400 hidden lg:block"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 rounded-xl shadow-lg border border-slate-200 p-1"
          >
            {/* Profile summary in dropdown */}
            <div className="px-3 py-2.5">
              <p className="text-[13px] font-semibold text-slate-800">
                Alex Johnson
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                alex.johnson@university.edu
              </p>
            </div>
            <DropdownMenuSeparator className="bg-slate-100" />

            <DropdownMenuItem
              asChild
              className="focus:bg-[#6C1D5F]/5 focus:text-[#6C1D5F] rounded-lg cursor-pointer"
            >
              <Link
                to="/student/profile"
                className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium w-full text-slate-700"
              >
                <User size={14} />
                My Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="focus:bg-[#6C1D5F]/5 focus:text-[#6C1D5F] rounded-lg cursor-pointer"
            >
              <Link
                to="/student/courses"
                className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium w-full text-slate-700"
              >
                <BookOpen size={14} />
                My Courses
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="focus:bg-[#6C1D5F]/5 focus:text-[#6C1D5F] rounded-lg cursor-pointer"
            >
              <Link
                to="/student/settings"
                className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium w-full text-slate-700"
              >
                <Settings size={14} />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="focus:bg-[#6C1D5F]/5 focus:text-[#6C1D5F] rounded-lg cursor-pointer flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-slate-700"
            >
              <HelpCircle size={14} />
              Help & Support
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100" />

            <DropdownMenuItem
              asChild
              className="focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer"
            >
              <Link
                to="/"
                className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium w-full text-slate-700 hover:text-rose-600"
              >
                <LogOut size={14} className="text-rose-500" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
