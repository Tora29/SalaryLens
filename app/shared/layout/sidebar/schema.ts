import type { ComponentType } from "react";

import { z } from "zod";

// テーマ
export const themeSchema = z.enum(["light", "dark"]);
export type Theme = z.infer<typeof themeSchema>;

// ナビゲーション項目（DB由来）
export const navigationItemSchema = z.object({
  id: z.string(),
  path: z.string(),
  label: z.string(),
  iconName: z.string(),
  sortOrder: z.number(),
  isActive: z.boolean(),
});
export type NavigationItem = z.infer<typeof navigationItemSchema>;

// アイコン付きナビゲーション項目（UI用）
export type NavigationItemWithIcon = NavigationItem & {
  icon: ComponentType<{ className?: string }>;
};

// Sidebar Props
export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialTheme: Theme;
  navigationItems: NavigationItemWithIcon[];
}

// MobileHeader Props
export interface MobileHeaderProps {
  onMenuClick: () => void;
}
