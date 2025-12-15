import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import type { SalaryRecord } from "../../schema";
import { PayslipsTable } from "../../components/PayslipsTable";

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

describe("PayslipsTable", () => {
  const defaultProps = {
    records: [
      createMockRecord({
        id: "1",
        month: 1,
        totalEarnings: 400000,
        totalDeductions: 80000,
        netSalary: 320000,
      }),
      createMockRecord({
        id: "2",
        month: 2,
        totalEarnings: 420000,
        totalDeductions: 85000,
        netSalary: 335000,
      }),
    ],
    isAllYears: false,
    onRecordClick: vi.fn(),
  };

  it("テーブルヘッダーが表示される", () => {
    render(<PayslipsTable {...defaultProps} />);

    expect(screen.getByText("支給合計")).toBeInTheDocument();
    expect(screen.getByText("控除合計")).toBeInTheDocument();
    expect(screen.getByText("差引支給額")).toBeInTheDocument();
  });

  it("isAllYears が false の場合、ヘッダーに「月」が表示される", () => {
    render(<PayslipsTable {...defaultProps} isAllYears={false} />);

    expect(screen.getByText("月")).toBeInTheDocument();
  });

  it("isAllYears が true の場合、ヘッダーに「年月」が表示される", () => {
    render(<PayslipsTable {...defaultProps} isAllYears={true} />);

    expect(screen.getByText("年月")).toBeInTheDocument();
  });

  it("レコードが表示される", () => {
    render(<PayslipsTable {...defaultProps} />);

    // 月表示（isAllYears: false）
    expect(screen.getByText("1月")).toBeInTheDocument();
    expect(screen.getByText("2月")).toBeInTheDocument();
  });

  it("isAllYears が true の場合、年月形式で表示される", () => {
    render(<PayslipsTable {...defaultProps} isAllYears={true} />);

    expect(screen.getByText("2024年1月")).toBeInTheDocument();
    expect(screen.getByText("2024年2月")).toBeInTheDocument();
  });

  it("金額がフォーマットされて表示される", () => {
    render(<PayslipsTable {...defaultProps} />);

    // formatCurrency により ￥400,000 形式で表示（全角円記号）
    expect(screen.getByText("￥400,000")).toBeInTheDocument();
    expect(screen.getByText("￥80,000")).toBeInTheDocument();
    expect(screen.getByText("￥320,000")).toBeInTheDocument();
  });

  it("行をクリックすると onRecordClick が呼ばれる", () => {
    const onRecordClick = vi.fn();
    render(<PayslipsTable {...defaultProps} onRecordClick={onRecordClick} />);

    // テーブル行をクリック（1月のレコード）
    const rows = screen.getAllByRole("row");
    // rows[0] はヘッダー行、rows[1] 以降がデータ行
    const dataRow = rows[1];
    if (dataRow) {
      fireEvent.click(dataRow);
    }

    expect(onRecordClick).toHaveBeenCalledTimes(1);
    expect(onRecordClick).toHaveBeenCalledWith(defaultProps.records[0]);
  });

  it("複数のレコードがある場合、正しい数の行が表示される", () => {
    render(<PayslipsTable {...defaultProps} />);

    // ヘッダー1行 + データ2行 = 3行
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
  });

  it("空のレコード配列の場合、ヘッダーのみ表示される", () => {
    render(<PayslipsTable {...defaultProps} records={[]} />);

    // ヘッダー行のみ
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1);
  });
});
