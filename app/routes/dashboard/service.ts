import type { SalaryRecord, SummaryData } from "./schema";

/**
 * 給与サマリーを計算する
 */
export function calculateSummary(records: SalaryRecord[]): SummaryData {
  const totalNetSalary = records.reduce((sum, r) => sum + r.netSalary, 0);
  const averageNetSalary =
    records.length > 0 ? Math.floor(totalNetSalary / records.length) : 0;
  const totalEarnings = records.reduce((sum, r) => sum + r.totalEarnings, 0);
  const totalDeductions = records.reduce(
    (sum, r) => sum + r.totalDeductions,
    0
  );
  // 前年比は仮の値（将来的に前年データと比較）
  const yearOverYearChange = 3.5;

  return {
    totalNetSalary,
    averageNetSalary,
    totalEarnings,
    totalDeductions,
    yearOverYearChange,
  };
}

/**
 * 直近のレコードを取得する
 */
export function getRecentRecords(
  records: SalaryRecord[],
  count: number
): SalaryRecord[] {
  return [...records].reverse().slice(0, count);
}
