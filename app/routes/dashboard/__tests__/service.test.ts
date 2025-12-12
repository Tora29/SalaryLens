import { describe, it, expect } from "vitest";
import { calculateSummary, getRecentRecords } from "../service";
import type { SalaryRecord } from "../schema";

// テスト用のモックデータ作成ヘルパー
const createMockRecord = (
  overrides: Partial<SalaryRecord> = {}
): SalaryRecord => ({
  id: "test-id",
  year: 2025,
  month: 1,

  // 勤怠
  extraOvertimeMinutes: 900,
  over60OvertimeMinutes: 0,
  nightOvertimeMinutes: 0,
  paidLeaveDays: 1.0,
  paidLeaveRemainingDays: 10.0,

  // 支給
  baseSalary: 300000,
  fixedOvertimeAllowance: 100000,
  overtimeAllowance: 30000,
  over60OvertimeAllowance: 0,
  nightAllowance: 0,
  specialAllowance: 10000,
  expenseReimbursement: 0,
  commuteAllowance: 10000,
  stockIncentive: 0,
  totalEarnings: 450000,

  // 控除
  healthInsurance: 20000,
  pensionInsurance: 40000,
  employmentInsurance: 3000,
  residentTax: 15000,
  incomeTax: 30000,
  stockContribution: 0,
  totalDeductions: 108000,

  // 差引支給額
  netSalary: 342000,

  ...overrides,
});

describe("calculateSummary", () => {
  it("正常系: 複数レコードのサマリーを計算できる", () => {
    // Arrange
    const records: SalaryRecord[] = [
      createMockRecord({
        id: "1",
        netSalary: 300000,
        totalEarnings: 450000,
        totalDeductions: 150000,
      }),
      createMockRecord({
        id: "2",
        netSalary: 350000,
        totalEarnings: 500000,
        totalDeductions: 150000,
      }),
      createMockRecord({
        id: "3",
        netSalary: 320000,
        totalEarnings: 470000,
        totalDeductions: 150000,
      }),
    ];

    // Act
    const result = calculateSummary(records);

    // Assert
    expect(result.totalNetSalary).toBe(970000);
    expect(result.averageNetSalary).toBe(323333); // Math.floor(970000 / 3)
    expect(result.totalEarnings).toBe(1420000);
    expect(result.totalDeductions).toBe(450000);
    expect(result.yearOverYearChange).toBe(3.5); // 固定値
  });

  it("正常系: 1件のレコードでサマリーを計算できる", () => {
    // Arrange
    const records: SalaryRecord[] = [
      createMockRecord({
        netSalary: 400000,
        totalEarnings: 600000,
        totalDeductions: 200000,
      }),
    ];

    // Act
    const result = calculateSummary(records);

    // Assert
    expect(result.totalNetSalary).toBe(400000);
    expect(result.averageNetSalary).toBe(400000);
    expect(result.totalEarnings).toBe(600000);
    expect(result.totalDeductions).toBe(200000);
  });

  it("エッジケース: 空配列の場合は0を返す", () => {
    // Arrange
    const records: SalaryRecord[] = [];

    // Act
    const result = calculateSummary(records);

    // Assert
    expect(result.totalNetSalary).toBe(0);
    expect(result.averageNetSalary).toBe(0);
    expect(result.totalEarnings).toBe(0);
    expect(result.totalDeductions).toBe(0);
  });

  it("エッジケース: netSalaryが負の値を含む場合も計算できる", () => {
    // Arrange（マイナス: 控除が大きい場合など）
    const records: SalaryRecord[] = [
      createMockRecord({ netSalary: 300000 }),
      createMockRecord({ netSalary: -50000 }),
    ];

    // Act
    const result = calculateSummary(records);

    // Assert
    expect(result.totalNetSalary).toBe(250000);
    expect(result.averageNetSalary).toBe(125000);
  });
});

describe("getRecentRecords", () => {
  it("正常系: 指定した件数の直近レコードを取得できる", () => {
    // Arrange
    const records: SalaryRecord[] = [
      createMockRecord({ id: "1", month: 1 }),
      createMockRecord({ id: "2", month: 2 }),
      createMockRecord({ id: "3", month: 3 }),
      createMockRecord({ id: "4", month: 4 }),
      createMockRecord({ id: "5", month: 5 }),
    ];

    // Act
    const result = getRecentRecords(records, 3);

    // Assert
    expect(result).toHaveLength(3);
    // 逆順で取得されるため、月が5, 4, 3の順になる
    expect(result[0].month).toBe(5);
    expect(result[1].month).toBe(4);
    expect(result[2].month).toBe(3);
  });

  it("正常系: レコード数より多い件数を指定した場合は全件返す", () => {
    // Arrange
    const records: SalaryRecord[] = [
      createMockRecord({ id: "1" }),
      createMockRecord({ id: "2" }),
    ];

    // Act
    const result = getRecentRecords(records, 5);

    // Assert
    expect(result).toHaveLength(2);
  });

  it("正常系: count=0の場合は空配列を返す", () => {
    // Arrange
    const records: SalaryRecord[] = [createMockRecord({ id: "1" })];

    // Act
    const result = getRecentRecords(records, 0);

    // Assert
    expect(result).toHaveLength(0);
  });

  it("エッジケース: 空配列の場合は空配列を返す", () => {
    // Arrange
    const records: SalaryRecord[] = [];

    // Act
    const result = getRecentRecords(records, 5);

    // Assert
    expect(result).toHaveLength(0);
  });

  it("元の配列を変更しない（イミュータブル）", () => {
    // Arrange
    const records: SalaryRecord[] = [
      createMockRecord({ id: "1", month: 1 }),
      createMockRecord({ id: "2", month: 2 }),
    ];
    const originalOrder = records.map((r) => r.id);

    // Act
    getRecentRecords(records, 2);

    // Assert: 元の配列の順序が変わっていないことを確認
    expect(records.map((r) => r.id)).toEqual(originalOrder);
  });
});
