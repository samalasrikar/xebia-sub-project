import { NavLink } from "react-router-dom";
import menuItems from "./menuItems";

export default function SidebarMenu() {
  return (
    <nav className="flex-1 mt-6 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-[#F0DAEA] text-[#6C1D5F] font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={20} />
            <span>{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}