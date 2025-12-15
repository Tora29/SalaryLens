import { describe, it, expect } from "vitest";

import type { SalaryRecord } from "../schema";
import {
  formatMinutesToHoursAndMinutes,
  generateCsvContent,
  generateCsvFilename,
  filterRecordsForExport,
} from "../service";

// テスト用のモックデータ
function createMockRecord(overrides: Partial<SalaryRecord> = {}): SalaryRecord {
  return {
    id: "test-id",
    year: 2024,
    month: 1,
    extraOvertimeMinutes: 0,
    over60OvertimeMinutes: 0,
    nightOvertimeMinutes: 0,
    paidLeaveDays: 0,
    paidLeaveRemainingDays: 10,
    baseSalary: 300000,
    fixedOvertimeAllowance: 50000,
    overtimeAllowance: 0,
    over60OvertimeAllowance: 0,
    nightAllowance: 0,
    specialAllowance: 0,
    expenseReimbursement: 0,
    commuteAllowance: 10000,
    stockIncentive: 0,
    totalEarnings: 360000,
    healthInsurance: 15000,
    pensionInsurance: 27000,
    employmentInsurance: 1800,
    residentTax: 20000,
    incomeTax: 10000,
    stockContribution: 0,
    totalDeductions: 73800,
    netSalary: 286200,
    ...overrides,
  };
}

describe("formatMinutesToHoursAndMinutes", () => {
  it("正常系: 分を「X時間Y分」形式にフォーマットする", () => {
    expect(formatMinutesToHoursAndMinutes(90)).toBe("1時間30分");
    expect(formatMinutesToHoursAndMinutes(120)).toBe("2時間0分");
    expect(formatMinutesToHoursAndMinutes(45)).toBe("0時間45分");
  });

  it("境界値: 0分の場合", () => {
    expect(formatMinutesToHoursAndMinutes(0)).toBe("0時間0分");
  });

  it("境界値: ちょうど1時間の場合", () => {
    expect(formatMinutesToHoursAndMinutes(60)).toBe("1時間0分");
  });

  it("正常系: 大きな値（10時間以上）", () => {
    expect(formatMinutesToHoursAndMinutes(630)).toBe("10時間30分");
  });
});

describe("generateCsvContent", () => {
  it("正常系: レコードからCSVコンテンツを生成する", () => {
    const records = [createMockRecord()];
    const csv = generateCsvContent(records);

    // ヘッダー行を確認
    expect(csv).toContain(
      "年月,基本給,固定時間外手当,残業手当,支給合計,健康保険料,厚生年金保険,雇用保険料,住民税,所得税,控除合計,差引支給額"
    );
    // データ行を確認
    expect(csv).toContain(
      "2024年1月,300000,50000,0,360000,15000,27000,1800,20000,10000,73800,286200"
    );
  });

  it("正常系: 複数レコードの場合、行数が正しい", () => {
    const records = [
      createMockRecord({ month: 1 }),
      createMockRecord({ month: 2 }),
      createMockRecord({ month: 3 }),
    ];
    const csv = generateCsvContent(records);
    const lines = csv.split("\n");

    // ヘッダー1行 + データ3行
    expect(lines).toHaveLength(4);
  });

  it("境界値: 空配列の場合、ヘッダーのみ", () => {
    const csv = generateCsvContent([]);
    const lines = csv.split("\n");

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("年月");
  });
});

describe("generateCsvFilename", () => {
  it("正常系: rangeType='all' の場合", () => {
    const filename = generateCsvFilename("all");
    expect(filename).toBe("給与明細.csv");
  });

  it("正常系: rangeType='year' の場合", () => {
    const filename = generateCsvFilename("year", 2024);
    expect(filename).toBe("給与明細_2024.csv");
  });

  it("正常系: rangeType='month' の場合（1桁月は0埋め）", () => {
    const filename = generateCsvFilename("month", 2024, 1);
    expect(filename).toBe("給与明細_2024_01.csv");
  });

  it("正常系: rangeType='month' の場合（2桁月）", () => {
    const filename = generateCsvFilename("month", 2024, 12);
    expect(filename).toBe("給与明細_2024_12.csv");
  });
});

describe("filterRecordsForExport", () => {
  const records: SalaryRecord[] = [
    createMockRecord({ id: "1", year: 2023, month: 11 }),
    createMockRecord({ id: "2", year: 2023, month: 12 }),
    createMockRecord({ id: "3", year: 2024, month: 1 }),
    createMockRecord({ id: "4", year: 2024, month: 2 }),
    createMockRecord({ id: "5", year: 2024, month: 3 }),
  ];

  it("正常系: rangeType='all' の場合、全レコードを返す", () => {
    const filtered = filterRecordsForExport(records, "all");
    expect(filtered).toHaveLength(5);
  });

  it("正常系: rangeType='year' の場合、指定年のレコードのみ返す", () => {
    const filtered = filterRecordsForExport(records, "year", 2024);
    expect(filtered).toHaveLength(3);
    expect(filtered.every((r) => r.year === 2024)).toBe(true);
  });

  it("正常系: rangeType='month' の場合、指定年月のレコードのみ返す", () => {
    const filtered = filterRecordsForExport(records, "month", 2024, 1);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.year).toBe(2024);
    expect(filtered[0]?.month).toBe(1);
  });

  it("境界値: 該当レコードがない年の場合、空配列を返す", () => {
    const filtered = filterRecordsForExport(records, "year", 2022);
    expect(filtered).toHaveLength(0);
  });

  it("境界値: 該当レコードがない月の場合、空配列を返す", () => {
    const filtered = filterRecordsForExport(records, "month", 2024, 12);
    expect(filtered).toHaveLength(0);
  });

  it("境界値: 空配列から検索する場合", () => {
    const filtered = filterRecordsForExport([], "all");
    expect(filtered).toHaveLength(0);
  });
});
