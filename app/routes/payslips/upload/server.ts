// 型定義
import type { ActionData, PayslipData, PayslipFormData } from "./schema";

// サーバー・ロジック
import { payslipSchema } from "./schema";
import {
  createDefaultPayslipData,
  extractPayslipFromFormData,
  isAllowedFileType,
  minutesToTimeString,
} from "./service";
import { parsePdfPayslip } from "./util-pdf-parser.server";

// 共有ライブラリ
import { prisma } from "~/shared/lib/db.server";

// 共有ユーティリティ
import { formatNumberWithCommas } from "~/shared/utils/format";

/**
 * PayslipData を確認画面用の PayslipFormData に変換する
 * - 時間フィールド: 分 → HH:MM 形式
 * - 金額フィールド: 数値 → カンマ区切り文字列
 */
function toFormData(data: PayslipData): PayslipFormData {
  return {
    // 基本情報
    year: data.year,
    month: data.month,

    // 勤怠（時間は HH:MM 形式）
    extraOvertimeMinutes: minutesToTimeString(data.extraOvertimeMinutes),
    over60OvertimeMinutes: minutesToTimeString(data.over60OvertimeMinutes),
    nightOvertimeMinutes: minutesToTimeString(data.nightOvertimeMinutes),
    paidLeaveDays: data.paidLeaveDays,
    paidLeaveRemainingDays: data.paidLeaveRemainingDays,

    // 支給（カンマ区切り）
    baseSalary: formatNumberWithCommas(data.baseSalary),
    fixedOvertimeAllowance: formatNumberWithCommas(data.fixedOvertimeAllowance),
    overtimeAllowance: formatNumberWithCommas(data.overtimeAllowance),
    over60OvertimeAllowance: formatNumberWithCommas(
      data.over60OvertimeAllowance
    ),
    nightAllowance: formatNumberWithCommas(data.nightAllowance),
    specialAllowance: formatNumberWithCommas(data.specialAllowance),
    expenseReimbursement: formatNumberWithCommas(data.expenseReimbursement),
    commuteAllowance: formatNumberWithCommas(data.commuteAllowance),
    stockIncentive: formatNumberWithCommas(data.stockIncentive),
    totalEarnings: formatNumberWithCommas(data.totalEarnings),

    // 控除（カンマ区切り）
    healthInsurance: formatNumberWithCommas(data.healthInsurance),
    pensionInsurance: formatNumberWithCommas(data.pensionInsurance),
    employmentInsurance: formatNumberWithCommas(data.employmentInsurance),
    residentTax: formatNumberWithCommas(data.residentTax),
    incomeTax: formatNumberWithCommas(data.incomeTax),
    stockContribution: formatNumberWithCommas(data.stockContribution),
    totalDeductions: formatNumberWithCommas(data.totalDeductions),

    // 差引支給額（カンマ区切り）
    netSalary: formatNumberWithCommas(data.netSalary),
  };
}

/**
 * ファイルアップロード処理
 */
export async function handleFileUpload(file: File | null): Promise<ActionData> {
  if (!file || file.size === 0) {
    return { success: false, error: "ファイルが選択されていません" };
  }

  if (!isAllowedFileType(file.type)) {
    return {
      success: false,
      error: "PDF または画像ファイル（PNG, JPG）を選択してください",
    };
  }

  // PDFの場合はテキスト解析を実行
  if (file.type === "application/pdf") {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parsedData = await parsePdfPayslip(buffer);
      return {
        step: "confirm",
        data: toFormData(parsedData),
        fileName: file.name,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("PDF解析エラー:", error);
      // 解析に失敗した場合はデフォルト値で続行
      const defaultData = createDefaultPayslipData();
      return {
        step: "confirm",
        data: toFormData(defaultData),
        fileName: file.name,
      };
    }
  }

  // 画像の場合は現時点ではデフォルト値を返す（将来的にOCR実装予定）
  const defaultData = createDefaultPayslipData();
  return {
    step: "confirm",
    data: toFormData(defaultData),
    fileName: file.name,
  };
}

/**
 * 給与明細の保存処理
 */
export async function handleSavePayslip(
  formData: FormData
): Promise<ActionData> {
  const rawData = extractPayslipFromFormData(formData);
  const result = payslipSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, error: "入力内容に誤りがあります" };
  }

  await savePayslipToDatabase(result.data);

  return { success: true, message: "給与明細を保存しました" };
}

/**
 * 給与明細をDBに保存する
 */
async function savePayslipToDatabase(data: PayslipData): Promise<void> {
  await prisma.salary.create({
    data: {
      year: data.year,
      month: data.month,

      // 勤怠
      extraOvertimeMinutes: data.extraOvertimeMinutes,
      over60OvertimeMinutes: data.over60OvertimeMinutes,
      nightOvertimeMinutes: data.nightOvertimeMinutes,
      paidLeaveDays: data.paidLeaveDays,
      paidLeaveRemainingDays: data.paidLeaveRemainingDays,

      // 支給
      baseSalary: data.baseSalary,
      fixedOvertimeAllowance: data.fixedOvertimeAllowance,
      overtimeAllowance: data.overtimeAllowance,
      over60OvertimeAllowance: data.over60OvertimeAllowance,
      nightAllowance: data.nightAllowance,
      specialAllowance: data.specialAllowance,
      expenseReimbursement: data.expenseReimbursement,
      commuteAllowance: data.commuteAllowance,
      stockIncentive: data.stockIncentive,
      totalEarnings: data.totalEarnings,

      // 控除
      healthInsurance: data.healthInsurance,
      pensionInsurance: data.pensionInsurance,
      employmentInsurance: data.employmentInsurance,
      residentTax: data.residentTax,
      incomeTax: data.incomeTax,
      stockContribution: data.stockContribution,
      totalDeductions: data.totalDeductions,

      // 差引支給額
      netSalary: data.netSalary,
    },
  });
}
