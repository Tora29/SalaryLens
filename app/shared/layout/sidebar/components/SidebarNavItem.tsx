import { NavLink } from "react-router";

import type { NavigationItemWithIcon } from "../schema";

interface SidebarNavItemProps {
  item: NavigationItemWithIcon;
  onClick?: () => void;
}

// サイドバーナビゲーションアイテム
export function SidebarNavItem({ item, onClick }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 h-14 rounded-full transition-colors ${
          isActive
            ? "bg-violet-100 dark:bg-violet-900/40 text-violet-900 dark:text-violet-100"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-900/8 dark:hover:bg-white/8"
        }`
      }
    >
      <Icon className="w-6 h-6 shrink-0" />
      <span className="text-sm font-medium">{item.label}</span>
    </NavLink>
  );
}
