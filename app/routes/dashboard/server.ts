import { prisma } from "~/shared/lib/db.server";
import type { LoaderData } from "./schema";

/**
 * ダッシュボード用のデータを取得する
 */
export async function getDashboardData(): Promise<LoaderData> {
  const salaryRecords = await prisma.salaryRecord.findMany({
    orderBy: [{ year: "asc" }, { month: "asc" }],
  });

  // スキーマに合わせて変換
  const monthlySalaries = salaryRecords.map((record) => ({
    id: record.id,
    year: record.year,
    month: record.month,
    baseSalary: record.baseSalary,
    overtime: record.overtime,
    bonus: record.bonus,
    deductions: record.deductions,
    netSalary: record.netSalary,
    fixedOvertimeHours: record.fixedOvertimeHours,
    extraOvertimeHours: record.extraOvertimeHours,
    over60OvertimeHours: record.over60OvertimeHours,
  }));

  const totalNetSalary = monthlySalaries.reduce(
    (sum, r) => sum + r.netSalary,
    0
  );
  const averageNetSalary =
    monthlySalaries.length > 0
      ? Math.floor(totalNetSalary / monthlySalaries.length)
      : 0;
  const totalBonus = monthlySalaries.reduce((sum, r) => sum + r.bonus, 0);
  // 前年比は仮の値（将来的に前年データと比較）
  const yearOverYearChange = 3.5;

  return {
    summary: {
      totalNetSalary,
      averageNetSalary,
      totalBonus,
      yearOverYearChange,
    },
    monthlySalaries,
    recentRecords: [...monthlySalaries].reverse().slice(0, 5),
  };
}
