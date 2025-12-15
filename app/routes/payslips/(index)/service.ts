// 型定義
import type { ExportRangeType, SalaryRecord } from "./schema";

// CSV出力用のヘッダー
const CSV_HEADERS = [
  "年月",
  "基本給",
  "固定時間外手当",
  "残業手当",
  "支給合計",
  "健康保険料",
  "厚生年金保険",
  "雇用保険料",
  "住民税",
  "所得税",
  "控除合計",
  "差引支給額",
];

/**
 * 給与レコードをCSVの1行に変換する
 */
function recordToCsvRow(record: SalaryRecord): string {
  const values = [
    `${record.year}年${record.month}月`,
    record.baseSalary,
    record.fixedOvertimeAllowance,
    record.overtimeAllowance,
    record.totalEarnings,
    record.healthInsurance,
    record.pensionInsurance,
    record.employmentInsurance,
    record.residentTax,
    record.incomeTax,
    record.totalDeductions,
    record.netSalary,
  ];
  return values.join(",");
}

/**
 * 複数の給与レコードからCSVコンテンツを生成する
 */
export function generateCsvContent(records: SalaryRecord[]): string {
  const rows = records.map(recordToCsvRow);
  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

/**
 * CSVファイル名を生成する
 * 形式: 給与明細_{yyyy}_{mm}.csv
 */
export function generateCsvFilename(
  rangeType: ExportRangeType,
  year?: number,
  month?: number
): string {
  switch (rangeType) {
    case "all":
      return "給与明細.csv";
    case "year":
      return `給与明細_${year}.csv`;
    case "month": {
      const paddedMonth = String(month).padStart(2, "0");
      return `給与明細_${year}_${paddedMonth}.csv`;
    }
  }
}

/**
 * エクスポート対象のレコードをフィルタリングする
 */
export function filterRecordsForExport(
  records: SalaryRecord[],
  rangeType: ExportRangeType,
  year?: number,
  month?: number
): SalaryRecord[] {
  switch (rangeType) {
    case "all":
      return records;
    case "year":
      return records.filter((r) => r.year === year);
    case "month":
      return records.filter((r) => r.year === year && r.month === month);
  }
}
