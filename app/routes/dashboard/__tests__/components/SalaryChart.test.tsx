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
  baseSalary: 300000,
  overtime: 50000,
  bonus: 0,
  deductions: 50000,
  netSalary: 300000,
  fixedOvertimeHours: 20,
  extraOvertimeHours: 5,
  over60OvertimeHours: 0,
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
