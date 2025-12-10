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
    expect(screen.getByText("賞与")).toBeInTheDocument();
    expect(screen.getByText("控除")).toBeInTheDocument();
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
        overtime: 50000,
        bonus: 100000,
        deductions: 80000,
        netSalary: 370000,
      }),
    ];

    // Act
    render(<RecentHistory records={records} />);

    // Assert
    expect(screen.getByText("2025年 3月")).toBeInTheDocument();
    expect(screen.getByText("￥300,000")).toBeInTheDocument(); // 基本給
    expect(screen.getByText("￥50,000")).toBeInTheDocument(); // 残業代
    expect(screen.getByText("￥100,000")).toBeInTheDocument(); // 賞与
    expect(screen.getByText("-￥80,000")).toBeInTheDocument(); // 控除
    expect(screen.getByText("￥370,000")).toBeInTheDocument(); // 手取り
  });

  it("正常系: 賞与が0の場合は'-'を表示する", () => {
    // Arrange
    const records: SalaryRecord[] = [
      createMockRecord({
        id: "1",
        bonus: 0,
      }),
    ];

    // Act
    render(<RecentHistory records={records} />);

    // Assert: 賞与列に'-'が表示される
    const cells = screen.getAllByRole("cell");
    // 賞与セル（4番目）に'-'があることを確認
    const bonusCell = cells.find((cell) => cell.textContent === "-");
    expect(bonusCell).toBeInTheDocument();
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
