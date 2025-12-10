import { z } from "zod";

// 給与記録スキーマ
export const salaryRecordSchema = z.object({
  id: z.string(),
  year: z.number(),
  month: z.number().min(1).max(12),
  baseSalary: z.number().nonnegative(),
  overtime: z.number().nonnegative(),
  bonus: z.number().nonnegative(),
  deductions: z.number().nonnegative(),
  netSalary: z.number(),
  // 残業時間
  fixedOvertimeHours: z.number().nonnegative(), // 固定残業（45h上限）
  extraOvertimeHours: z.number().nonnegative(), // 固定外残業
  over60OvertimeHours: z.number().nonnegative(), // 60h超残業
});

// サマリーデータスキーマ
export const summaryDataSchema = z.object({
  totalNetSalary: z.number(),
  averageNetSalary: z.number(),
  totalBonus: z.number(),
  yearOverYearChange: z.number(),
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
