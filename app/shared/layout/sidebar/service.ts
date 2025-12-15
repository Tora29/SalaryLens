// ライブラリ
import {
  LayoutDashboard,
  Upload,
  Settings,
  Home,
  FileText,
  BarChart,
  Users,
  type LucideIcon,
} from "lucide-react";

// 型定義
import type { NavigationItem, NavigationItemWithIcon, Theme } from "./schema";

// アイコン名からアイコンコンポーネントへのマッピング
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Upload,
  Settings,
  Home,
  FileText,
  BarChart,
  Users,
};

// デフォルトアイコン（マッピングにない場合）
const defaultIcon = FileText;

// アイコン名からアイコンコンポーネントを取得
export function getIconByName(iconName: string): LucideIcon {
  return iconMap[iconName] ?? defaultIcon;
}

// ナビゲーション項目にアイコンコンポーネントを付与
export function mapNavigationItemsWithIcons(
  items: NavigationItem[]
): NavigationItemWithIcon[] {
  return items.map((item) => ({
    ...item,
    icon: getIconByName(item.iconName),
  }));
}

// 次のテーマを取得（純粋関数）
export function getNextTheme(currentTheme: Theme): Theme {
  return currentTheme === "dark" ? "light" : "dark";
}

// テーマをCookieに保存するための値を生成
export function createThemeCookieValue(theme: Theme): string {
  return `theme=${theme}; Path=/; SameSite=Lax; Max-Age=31536000`;
}
