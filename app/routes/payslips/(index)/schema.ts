// React・ライブラリ
import { z } from "zod";

// ========== メッセージ定数 ==========

export const MESSAGES = {
  error: {
    invalidDataFormat: "データ形式が不正です",
  },
  empty: {
    noRecords: "給与明細がありません",
    noRecordsForYear: (year: number) => `${year}年の給与明細がありません`,
  },
} as const;

// ========== 給与レコードスキーマ ==========

export const salaryRecordSchema = z.object({
  id: z.string(),
  year: z.number(),
  month: z.number().min(1).max(12),
  // 勤怠
  extraOvertimeMinutes: z.number().nonnegative(),
  over60OvertimeMinutes: z.number().nonnegative(),
  nightOvertimeMinutes: z.number().nonnegative(),
  paidLeaveDays: z.number().nonnegative(),
  paidLeaveRemainingDays: z.number().nonnegative(),
  // 支給
  baseSalary: z.number().nonnegative(),
  fixedOvertimeAllowance: z.number().nonnegative(),
  overtimeAllowance: z.number().nonnegative(),
  over60OvertimeAllowance: z.number().nonnegative(),
  nightAllowance: z.number().nonnegative(),
  specialAllowance: z.number().nonnegative(),
  expenseReimbursement: z.number().nonnegative(),
  commuteAllowance: z.number().nonnegative(),
  stockIncentive: z.number().nonnegative(),
  totalEarnings: z.number().nonnegative(),
  // 控除
  healthInsurance: z.number().nonnegative(),
  pensionInsurance: z.number().nonnegative(),
  employmentInsurance: z.number().nonnegative(),
  residentTax: z.number().nonnegative(),
  incomeTax: z.number().nonnegative(),
  stockContribution: z.number().nonnegative(),
  totalDeductions: z.number().nonnegative(),
  // 差引
  netSalary: z.number(),
});

export type SalaryRecord = z.infer<typeof salaryRecordSchema>;

// ========== Loader用データ型 ==========

export type LoaderData = {
  records: SalaryRecord[];
  selectedYear: number | "all";
  availableYears: number[];
};

// ========== エクスポート関連型 ==========

/**
 * エクスポート範囲の種類
 */
export type ExportRangeType = "all" | "year" | "month";
