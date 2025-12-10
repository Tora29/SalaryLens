import { prisma } from "~/shared/lib/db.server";
import type { LoaderData, SalaryRecord } from "./schema";
import { calculateSummary, getRecentRecords } from "./service";

/**
 * DBから給与レコードを取得する
 */
async function fetchSalaryRecords(): Promise<SalaryRecord[]> {
  const records = await prisma.salaryRecord.findMany({
    orderBy: [{ year: "asc" }, { month: "asc" }],
  });

  return records.map((record) => ({
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
}

/**
 * ダッシュボード用のデータを取得する
 */
export async function getDashboardData(): Promise<LoaderData> {
  const monthlySalaries = await fetchSalaryRecords();

  return {
    summary: calculateSummary(monthlySalaries),
    monthlySalaries,
    recentRecords: getRecentRecords(monthlySalaries, 5),
  };
}
