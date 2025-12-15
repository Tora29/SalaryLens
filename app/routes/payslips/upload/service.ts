// 型定義
import type { AllowedFileType, PayslipData } from "./schema";

// ローカルスキーマ
import { ALLOWED_FILE_TYPES } from "./schema";

/**
 * ファイル形式が許可されているかチェックする
 */
export function isAllowedFileType(
  fileType: string
): fileType is AllowedFileType {
  return ALLOWED_FILE_TYPES.includes(fileType as AllowedFileType);
}

/**
 * ファイルが画像かどうかをチェックする
 */
export function isImageFile(fileType: string): boolean {
  return fileType.startsWith("image/");
}

/**
 * デフォルトの給与明細データを生成する
 * TODO: 実際のOCR処理やPDF解析の結果をここで変換する
 */
export function createDefaultPayslipData(date: Date = new Date()): PayslipData {
  return {
    // 基本情報
    year: date.getFullYear(),
    month: date.getMonth() + 1,

    // 勤怠
    extraOvertimeMinutes: 0,
    over60OvertimeMinutes: 0,
    nightOvertimeMinutes: 0,
    paidLeaveDays: 0,
    paidLeaveRemainingDays: 0,

    // 支給
    baseSalary: 0,
    fixedOvertimeAllowance: 0,
    overtimeAllowance: 0,
    over60OvertimeAllowance: 0,
    nightAllowance: 0,
    specialAllowance: 0,
    expenseReimbursement: 0,
    commuteAllowance: 0,
    stockIncentive: 0,
    totalEarnings: 0,

    // 控除
    healthInsurance: 0,
    pensionInsurance: 0,
    employmentInsurance: 0,
    residentTax: 0,
    incomeTax: 0,
    stockContribution: 0,
    totalDeductions: 0,

    // 差引支給額
    netSalary: 0,
  };
}

/**
 * FormDataの値を文字列として取得する
 */
function getStringValue(value: FormDataEntryValue | null): string {
  if (value === null || value instanceof File) {
    return "0:00";
  }
  return value;
}

/**
 * カンマ区切りの金額文字列を数値に変換する
 */
function parseCurrencyString(value: FormDataEntryValue | null): number {
  if (value === null || value instanceof File) {
    return 0;
  }
  return parseInt(value.replace(/,/g, ""), 10) || 0;
}

/**
 * FormDataから給与明細データを抽出する
 * 時間フィールドは HH:MM 形式から分に変換
 */
export function extractPayslipFromFormData(
  formData: FormData
): Record<string, number | FormDataEntryValue | null> {
  return {
    // 基本情報
    year: formData.get("year"),
    month: formData.get("month"),

    // 勤怠（時間フィールドは HH:MM → 分に変換）
    extraOvertimeMinutes: timeStringToMinutes(
      getStringValue(formData.get("extraOvertimeMinutes"))
    ),
    over60OvertimeMinutes: timeStringToMinutes(
      getStringValue(formData.get("over60OvertimeMinutes"))
    ),
    nightOvertimeMinutes: timeStringToMinutes(
      getStringValue(formData.get("nightOvertimeMinutes"))
    ),
    paidLeaveDays: formData.get("paidLeaveDays"),
    paidLeaveRemainingDays: formData.get("paidLeaveRemainingDays"),

    // 支給（カンマ区切り文字列を数値に変換）
    baseSalary: parseCurrencyString(formData.get("baseSalary")),
    fixedOvertimeAllowance: parseCurrencyString(
      formData.get("fixedOvertimeAllowance")
    ),
    overtimeAllowance: parseCurrencyString(formData.get("overtimeAllowance")),
    over60OvertimeAllowance: parseCurrencyString(
      formData.get("over60OvertimeAllowance")
    ),
    nightAllowance: parseCurrencyString(formData.get("nightAllowance")),
    specialAllowance: parseCurrencyString(formData.get("specialAllowance")),
    expenseReimbursement: parseCurrencyString(
      formData.get("expenseReimbursement")
    ),
    commuteAllowance: parseCurrencyString(formData.get("commuteAllowance")),
    stockIncentive: parseCurrencyString(formData.get("stockIncentive")),
    totalEarnings: parseCurrencyString(formData.get("totalEarnings")),

    // 控除（カンマ区切り文字列を数値に変換）
    healthInsurance: parseCurrencyString(formData.get("healthInsurance")),
    pensionInsurance: parseCurrencyString(formData.get("pensionInsurance")),
    employmentInsurance: parseCurrencyString(
      formData.get("employmentInsurance")
    ),
    residentTax: parseCurrencyString(formData.get("residentTax")),
    incomeTax: parseCurrencyString(formData.get("incomeTax")),
    stockContribution: parseCurrencyString(formData.get("stockContribution")),
    totalDeductions: parseCurrencyString(formData.get("totalDeductions")),

    // 差引支給額
    netSalary: parseCurrencyString(formData.get("netSalary")),
  };
}

/**
 * 時間文字列（HH:MM）を分に変換する
 */
export function timeStringToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d+):(\d+)$/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

/**
 * 分を時間文字列（HH:MM）に変換する
 */
export function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}
