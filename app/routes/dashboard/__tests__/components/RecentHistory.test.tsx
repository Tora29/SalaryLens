import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecentHistory } from "../../components/RecentHistory";
import type { SalaryRecord } from "../../schema";

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

describe("RecentHistory", () => {
  it("正常系: タイトルが表示される", () => {
    // Arrange
    const records: SalaryRecord[] = [];

    // Act
    render(<RecentHistory records={records} />);

    // Assert
    expect(screen.getByText("最近の給与明細")).toBeInTheDocument();
  });

  it("正常系: すべて表示ボタンが表示される", () => {
    // Arrange
    const records: SalaryRecord[] = [];

    // Act
    render(<RecentHistory records={records} />);

    // Assert
    expect(screen.getByText("すべて表示")).toBeInTheDocument();
  });

  it("正常系: テーブルヘッダーが表示される", () => {
    // Arrange
    const records: SalaryRecord[] = [];

    // Act
    render(<RecentHistory records={records} />);

    // Assert
    expect(screen.getByText("期間")).toBeInTheDocument();
    expect(screen.getByText("基本給")).toBeInTheDocument();
    expect(screen.getByText("残業代")).toBeInTheDocument();
    expect(screen.getByText("支給合計")).toBeInTheDocument();
    expect(screen.getByText("控除合計")).toBeInTheDocument();
    expect(screen.getByText("手取り")).toBeInTheDocument();
  });

  it("正常系: レコードデータが正しく表示される", () => {
    // Arrange
    const records: SalaryRecord[] = [
      createMockRecord({
        id: "1",
        year: 2025,
        month: 3,
        baseSalary: 300000,
        overtimeAllowance: 30000,
        over60OvertimeAllowance: 10000,
        nightAllowance: 10000,
        totalEarnings: 500000,
        totalDeductions: 80000,
        netSalary: 420000,
      }),
    ];

    // Act
    render(<RecentHistory records={records} />);

    // Assert
    expect(screen.getByText("2025年 3月")).toBeInTheDocument();
    expect(screen.getByText("￥300,000")).toBeInTheDocument(); // 基本給
    expect(screen.getByText("￥50,000")).toBeInTheDocument(); // 残業代（30000 + 10000 + 10000）
    expect(screen.getByText("￥500,000")).toBeInTheDocument(); // 支給合計
    expect(screen.getByText("-￥80,000")).toBeInTheDocument(); // 控除合計
    expect(screen.getByText("￥420,000")).toBeInTheDocument(); // 手取り
  });

  it("正常系: 複数のレコードを表示できる", () => {
    // Arrange
    const records: SalaryRecord[] = [
      createMockRecord({ id: "1", year: 2025, month: 1 }),
      createMockRecord({ id: "2", year: 2025, month: 2 }),
      createMockRecord({ id: "3", year: 2025, month: 3 }),
    ];

    // Act
    render(<RecentHistory records={records} />);

    // Assert
    expect(screen.getByText("2025年 1月")).toBeInTheDocument();
    expect(screen.getByText("2025年 2月")).toBeInTheDocument();
    expect(screen.getByText("2025年 3月")).toBeInTheDocument();
  });

  it("正常系: 空のレコード配列でもエラーなく表示できる", () => {
    // Arrange
    const records: SalaryRecord[] = [];

    // Act & Assert
    expect(() => render(<RecentHistory records={records} />)).not.toThrow();
    // テーブルボディが空であることを確認
    const rows = screen.queryAllByRole("row");
    // ヘッダー行のみ存在する
    expect(rows).toHaveLength(1);
  });
});
