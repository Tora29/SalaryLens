import type { PrismaClient } from "../generated/prisma/client";

// ナビゲーションのシードデータ
export const navigationData = [
  {
    path: "/",
    label: "ダッシュボード",
    iconName: "LayoutDashboard",
    sortOrder: 1,
    isActive: true,
  },
  {
    path: "/payslips",
    label: "給与明細一覧",
    iconName: "FileText",
    sortOrder: 2,
    isActive: true,
  },
  {
    path: "/payslips/upload",
    label: "給与明細アップロード",
    iconName: "Upload",
    sortOrder: 3,
    isActive: true,
  },
];

export async function seedNavigation(prisma: PrismaClient) {
  // eslint-disable-next-line no-console
  console.log("🌱 Seeding navigation...");

  for (const nav of navigationData) {
    await prisma.navigation.upsert({
      where: { path: nav.path },
      update: nav,
      create: nav,
    });
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Navigation seeded: ${navigationData.length} records`);
}
