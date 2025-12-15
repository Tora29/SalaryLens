// ライブラリ
import { z } from "zod";

// 許可されるファイル形式
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

// 給与明細バリデーションスキーマ
export const payslipSchema = z.object({
  // 基本情報
  year: z.coerce.number().min(2000).max(2100),
  month: z.coerce.number().min(1).max(12),

  // 勤怠
  extraOvertimeMinutes: z.coerce.number().min(0), // 固定外残業時間（分）
  over60OvertimeMinutes: z.coerce.number().min(0), // 固定外残業時間 60h超（分）
  nightOvertimeMinutes: z.coerce.number().min(0), // 深夜割増時間（分）
  paidLeaveDays: z.coerce.number().min(0), // 有休日数
  paidLeaveRemainingDays: z.coerce.number().min(0), // 有休残日数

  // 支給
  baseSalary: z.coerce.number().min(0), // 基本給
  fixedOvertimeAllowance: z.coerce.number().min(0), // 固定時間外手当
  overtimeAllowance: z.coerce.number().min(0), // 残業手当
  over60OvertimeAllowance: z.coerce.number().min(0), // 残業手当(60時間超)
  nightAllowance: z.coerce.number().min(0), // 深夜割増額
  specialAllowance: z.coerce.number().min(0), // 特別手当
  expenseReimbursement: z.coerce.number().min(0), // 立替経費
  commuteAllowance: z.coerce.number().min(0), // 非課税通勤費
  stockIncentive: z.coerce.number().min(0), // 持株会奨励金
  totalEarnings: z.coerce.number().min(0), // 支給合計

  // 控除
  healthInsurance: z.coerce.number().min(0), // 健康保険料
  pensionInsurance: z.coerce.number().min(0), // 厚生年金保険
  employmentInsurance: z.coerce.number().min(0), // 雇用保険料
  residentTax: z.coerce.number().min(0), // 住民税
  incomeTax: z.coerce.number().min(0), // 所得税
  stockContribution: z.coerce.number().min(0), // 持株会拠出金
  totalDeductions: z.coerce.number().min(0), // 控除合計

  // 差引支給額
  netSalary: z.coerce.number().min(0),
});

export type PayslipData = z.infer<typeof payslipSchema>;

// 確認画面用のフォームデータ型
// 時間フィールドは HH:MM 形式、金額フィールドはカンマ区切り文字列
export type PayslipFormData = {
  // 基本情報
  year: number;
  month: number;

  // 勤怠（時間は HH:MM 形式）
  extraOvertimeMinutes: string;
  over60OvertimeMinutes: string;
  nightOvertimeMinutes: string;
  paidLeaveDays: number;
  paidLeaveRemainingDays: number;

  // 支給（カンマ区切り文字列）
  baseSalary: string;
  fixedOvertimeAllowance: string;
  overtimeAllowance: string;
  over60OvertimeAllowance: string;
  nightAllowance: string;
  specialAllowance: string;
  expenseReimbursement: string;
  commuteAllowance: string;
  stockIncentive: string;
  totalEarnings: string;

  // 控除（カンマ区切り文字列）
  healthInsurance: string;
  pensionInsurance: string;
  employmentInsurance: string;
  residentTax: string;
  incomeTax: string;
  stockContribution: string;
  totalDeductions: string;

  // 差引支給額（カンマ区切り文字列）
  netSalary: string;
};

// action の結果型
export type ActionData =
  | { success: true; message: string }
  | { success: false; error: string }
  | { step: "confirm"; data: PayslipFormData; fileName: string };

// フィールド定義（UIで使用）
export const PAYSLIP_FIELDS = {
  attendance: [
    {
      id: "extraOvertimeMinutes",
      label: "固定外残業時間",
      suffix: "",
      inputType: "time" as const,
    },
    {
      id: "over60OvertimeMinutes",
      label: "固定外残業(60h超)",
      suffix: "",
      inputType: "time" as const,
    },
    {
      id: "nightOvertimeMinutes",
      label: "深夜割増時間",
      suffix: "",
      inputType: "time" as const,
    },
    {
      id: "paidLeaveDays",
      label: "有休日数",
      suffix: "日",
      inputType: "number" as const,
    },
    {
      id: "paidLeaveRemainingDays",
      label: "有休残日数",
      suffix: "日",
      inputType: "number" as const,
    },
  ],
  earnings: [
    { id: "baseSalary", label: "基本給", suffix: "円" },
    { id: "fixedOvertimeAllowance", label: "固定時間外手当", suffix: "円" },
    { id: "overtimeAllowance", label: "残業手当", suffix: "円" },
    { id: "over60OvertimeAllowance", label: "残業手当(60h超)", suffix: "円" },
    { id: "nightAllowance", label: "深夜割増額", suffix: "円" },
    { id: "specialAllowance", label: "特別手当", suffix: "円" },
    { id: "expenseReimbursement", label: "立替経費", suffix: "円" },
    { id: "commuteAllowance", label: "非課税通勤費", suffix: "円" },
    { id: "stockIncentive", label: "持株会奨励金", suffix: "円" },
    { id: "totalEarnings", label: "支給合計", suffix: "円" },
  ],
  deductions: [
    { id: "healthInsurance", label: "健康保険料", suffix: "円" },
    { id: "pensionInsurance", label: "厚生年金保険", suffix: "円" },
    { id: "employmentInsurance", label: "雇用保険料", suffix: "円" },
    { id: "residentTax", label: "住民税", suffix: "円" },
    { id: "incomeTax", label: "所得税", suffix: "円" },
    { id: "stockContribution", label: "持株会拠出金", suffix: "円" },
    { id: "totalDeductions", label: "控除合計", suffix: "円" },
  ],
} as const;

// PDF解析用のラベルマッピング
// PDFのラベル → { field: PayslipDataのフィールド名, type: 値の型 }
export const PDF_LABEL_MAPPINGS: Record<
  string,
  { field: keyof PayslipData; type: "time" | "currency" | "decimal" }
> = {
  // 勤怠
  固定外残業時間: { field: "extraOvertimeMinutes", type: "time" },
  "固定外残業時間(60時間超)": { field: "over60OvertimeMinutes", type: "time" },
  深夜割増時間: { field: "nightOvertimeMinutes", type: "time" },
  有休日数: { field: "paidLeaveDays", type: "decimal" },
  有休残日数: { field: "paidLeaveRemainingDays", type: "decimal" },

  // 支給
  "基本給(月給)": { field: "baseSalary", type: "currency" },
  固定時間外手当: { field: "fixedOvertimeAllowance", type: "currency" },
  残業手当: { field: "overtimeAllowance", type: "currency" },
  "残業手当(60時間超)": { field: "over60OvertimeAllowance", type: "currency" },
  深夜割増額: { field: "nightAllowance", type: "currency" },
  特別手当: { field: "specialAllowance", type: "currency" },
  立替経費: { field: "expenseReimbursement", type: "currency" },
  非課税通勤費: { field: "commuteAllowance", type: "currency" },
  持株会奨励金: { field: "stockIncentive", type: "currency" },

  // 控除
  健康保険料: { field: "healthInsurance", type: "currency" },
  厚生年金保険: { field: "pensionInsurance", type: "currency" },
  雇用保険料: { field: "employmentInsurance", type: "currency" },
  住民税: { field: "residentTax", type: "currency" },
  所得税: { field: "incomeTax", type: "currency" },
  持株会拠出金: { field: "stockContribution", type: "currency" },

  // 差引支給額
  "差引支給額:": { field: "netSalary", type: "currency" },
} as const;
