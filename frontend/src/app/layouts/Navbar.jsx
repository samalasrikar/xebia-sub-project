import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import adminProfileIcon from "../../assets/admin_profile_icon.svg";

export default function Navbar() {
  const location = useLocation();

  const formatPath = (path) => {
    if (path === "/") return "Welcome back, Admin! 👋";
    return path
      .split("/")
      .filter(Boolean)
      .filter((segment) => isNaN(segment)) // Filter out numeric IDs
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" / ");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur">

      {/* Left */}

      <div className="flex items-center gap-4">

        <button className="md:hidden">
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#6C1D5F]">
            {formatPath(location.pathname)}
          </h1>
        </div>

      </div>



      {/* Right */}

      <div className="flex items-center gap-4">

        <button className="relative rounded-full p-2 hover:bg-slate-100">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <button className="flex items-center gap-2 rounded-full hover:bg-slate-100 p-1 pr-2">

              <Avatar className="h-9 w-9">
                <AvatarImage src={adminProfileIcon} alt="Admin" />
                <AvatarFallback className="bg-[#6C1D5F] text-white">
                  A
                </AvatarFallback>
              </Avatar>

              <ChevronDown size={16} />

            </button>

          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem className="text-red-600">
              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </header>
  );
}