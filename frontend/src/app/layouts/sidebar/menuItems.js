import {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  Boxes,
  Network,
  FileText,
  Settings,
  CircleHelp,
  BarChart3,
  Briefcase,
  GraduationCap,
  Target,
  LineChart,
  LayoutTemplate,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: FolderTree,
  },
  {
    title: "Courses",
    path: "/courses",
    icon: BookOpen,
  },
  {
    title: "Module Management",
    path: "/module-management",
    icon: Boxes,
  },
  {
    title: "Curriculum Builder",
    path: "/curriculum",
    icon: LayoutTemplate,
  },
  {
    title: "Sub Modules",
    path: "/submodules",
    icon: Network,
  },
  {
    title: "Content",
    path: "/content",
    icon: FileText,
  },
];

export const footerItems = [
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Support",
    path: "/support",
    icon: CircleHelp,
  },
];

export default menuItems;