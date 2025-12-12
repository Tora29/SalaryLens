import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SalaryChart } from "../../components/SalaryChart";
import type { SalaryRecord } from "../../schema";

// Recharts の ResponsiveContainer はテスト環境で動作しないためモック
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

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

describe("SalaryChart", () => {
  it("正常系: タイトルが表示される", () => {
    // Arrange
    const mockData: SalaryRecord[] = [createMockRecord()];

    // Act
    render(<SalaryChart data={mockData} />);

    // Assert
    expect(screen.getByText("月別給与推移")).toBeInTheDocument();
  });

  it("正常系: チャートコンテナが表示される", () => {
    // Arrange
    const mockData: SalaryRecord[] = [createMockRecord()];

    // Act
    render(<SalaryChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("正常系: 空のデータでもエラーなく表示できる", () => {
    // Arrange
    const mockData: SalaryRecord[] = [];

    // Act & Assert: エラーなく描画できることを確認
    expect(() => render(<SalaryChart data={mockData} />)).not.toThrow();
    expect(screen.getByText("月別給与推移")).toBeInTheDocument();
  });

  it("正常系: 12ヶ月分のデータを受け入れる", () => {
    // Arrange
    const mockData: SalaryRecord[] = Array.from({ length: 12 }, (_, i) =>
      createMockRecord({ id: `${i + 1}`, month: i + 1 })
    );

    // Act & Assert: エラーなく描画できることを確認
    expect(() => render(<SalaryChart data={mockData} />)).not.toThrow();
  });
});
