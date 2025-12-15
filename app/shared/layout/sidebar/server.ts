// 共有ライブラリ
import { prisma } from "~/shared/lib/db.server";

// 型定義
import type { NavigationItem } from "./schema";

// 有効なナビゲーション項目を取得（sortOrder順）
export async function getActiveNavigationItems(): Promise<NavigationItem[]> {
  const items = await prisma.navigation.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return items.map((item) => ({
    id: item.id,
    path: item.path,
    label: item.label,
    iconName: item.iconName,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  }));
}

// 全てのナビゲーション項目を取得（管理用）
export async function getAllNavigationItems(): Promise<NavigationItem[]> {
  const items = await prisma.navigation.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return items.map((item) => ({
    id: item.id,
    path: item.path,
    label: item.label,
    iconName: item.iconName,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  }));
}
