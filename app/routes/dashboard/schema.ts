import { z } from "zod";

// 給与記録スキーマ（Prismaスキーマと一致）
export const salaryRecordSchema = z.object({
  id: z.string(),
  year: z.number(),
  month: z.number().min(1).max(12),

  // 勤怠
  extraOvertimeMinutes: z.number().nonnegative(), // 固定外残業時間（分）
  over60OvertimeMinutes: z.number().nonnegative(), // 60h超残業時間（分）
  nightOvertimeMinutes: z.number().nonnegative(), // 深夜割増時間（分）
  paidLeaveDays: z.number().nonnegative(), // 有休日数
  paidLeaveRemainingDays: z.number().nonnegative(), // 有休残日数

  // 支給
  baseSalary: z.number().nonnegative(), // 基本給
  fixedOvertimeAllowance: z.number().nonnegative(), // 固定時間外手当
  overtimeAllowance: z.number().nonnegative(), // 残業手当
  over60OvertimeAllowance: z.number().nonnegative(), // 残業手当(60h超)
  nightAllowance: z.number().nonnegative(), // 深夜割増額
  specialAllowance: z.number().nonnegative(), // 特別手当
  expenseReimbursement: z.number().nonnegative(), // 立替経費
  commuteAllowance: z.number().nonnegative(), // 非課税通勤費
  stockIncentive: z.number().nonnegative(), // 持株会奨励金
  totalEarnings: z.number().nonnegative(), // 支給合計

  // 控除
  healthInsurance: z.number().nonnegative(), // 健康保険料
  pensionInsurance: z.number().nonnegative(), // 厚生年金保険
  employmentInsurance: z.number().nonnegative(), // 雇用保険料
  residentTax: z.number().nonnegative(), // 住民税
  incomeTax: z.number().nonnegative(), // 所得税
  stockContribution: z.number().nonnegative(), // 持株会拠出金
  totalDeductions: z.number().nonnegative(), // 控除合計

  // 差引支給額
  netSalary: z.number(),
});

// サマリーデータスキーマ
export const summaryDataSchema = z.object({
  totalNetSalary: z.number(), // 手取り合計
  averageNetSalary: z.number(), // 平均手取り
  totalEarnings: z.number(), // 支給合計
  totalDeductions: z.number(), // 控除合計
  yearOverYearChange: z.number(), // 前年比
});

// ローダーデータスキーマ
export const loaderDataSchema = z.object({
  summary: summaryDataSchema,
  monthlySalaries: z.array(salaryRecordSchema),
  recentRecords: z.array(salaryRecordSchema),
});

// 型定義（スキーマから推論）
export type SalaryRecord = z.infer<typeof salaryRecordSchema>;
export type SummaryData = z.infer<typeof summaryDataSchema>;
export type LoaderData = z.infer<typeof loaderDataSchema>;
