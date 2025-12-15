import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { PayslipDetailModal } from "../../components/PayslipDetailModal";
import type { SalaryRecord } from "../../schema";

// Modalコンポーネントをモック
vi.mock("~/shared/components/Modal", () => ({
  Modal: ({
    title,
    onClose,
    children,
  }: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="modal" role="dialog" aria-label={title}>
      <h2>{title}</h2>
      <button onClick={onClose} aria-label="閉じる">
        閉じる
      </button>
      {children}
    </div>
  ),
}));

/**
 * テスト用のモックレコードを生成
 */
function createMockRecord(overrides: Partial<SalaryRecord> = {}): SalaryRecord {
  return {
    id: "test-id",
    year: 2024,
    month: 6,
    extraOvertimeMinutes: 120, // 2時間0分
    over60OvertimeMinutes: 30, // 0時間30分
    nightOvertimeMinutes: 60, // 1時間0分
    paidLeaveDays: 2,
    paidLeaveRemainingDays: 8,
    baseSalary: 300000,
    fixedOvertimeAllowance: 50000,
    overtimeAllowance: 15000,
    over60OvertimeAllowance: 5000,
    nightAllowance: 3000,
    specialAllowance: 10000,
    expenseReimbursement: 5000,
    commuteAllowance: 10000,
    stockIncentive: 2000,
    totalEarnings: 400000,
    healthInsurance: 15000,
    pensionInsurance: 28000,
    employmentInsurance: 2000,
    residentTax: 20000,
    incomeTax: 10000,
    stockContribution: 5000,
    totalDeductions: 80000,
    netSalary: 320000,
    ...overrides,
  };
}

describe("PayslipDetailModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("モーダルタイトル", () => {
    it("年月を含むタイトルが表示される", () => {
      const record = createMockRecord({ year: 2024, month: 6 });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(
        screen.getByRole("dialog", { name: "2024年6月の給与明細" })
      ).toBeInTheDocument();
    });

    it("異なる年月の場合、正しいタイトルが表示される", () => {
      const record = createMockRecord({ year: 2023, month: 12 });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(
        screen.getByRole("dialog", { name: "2023年12月の給与明細" })
      ).toBeInTheDocument();
    });
  });

  describe("勤怠情報セクション", () => {
    it("「勤怠情報」セクションヘッダーが表示される", () => {
      const record = createMockRecord();

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("勤怠情報")).toBeInTheDocument();
    });

    it("固定外残業時間が「時間分」形式で表示される", () => {
      const record = createMockRecord({ extraOvertimeMinutes: 90 }); // 1時間30分

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("固定外残業時間")).toBeInTheDocument();
      expect(screen.getByText("1時間30分")).toBeInTheDocument();
    });

    it("60h超残業時間が表示される", () => {
      const record = createMockRecord({ over60OvertimeMinutes: 30 }); // 0時間30分

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("60h超残業時間")).toBeInTheDocument();
      expect(screen.getByText("0時間30分")).toBeInTheDocument();
    });

    it("深夜割増時間が表示される", () => {
      const record = createMockRecord({
        nightOvertimeMinutes: 120,
        extraOvertimeMinutes: 0,
        over60OvertimeMinutes: 0,
      });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("深夜割増時間")).toBeInTheDocument();
      expect(screen.getByText("2時間0分")).toBeInTheDocument();
    });

    it("有休情報（使用/残）が表示される", () => {
      const record = createMockRecord({
        paidLeaveDays: 3,
        paidLeaveRemainingDays: 7,
      });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("有休")).toBeInTheDocument();
      expect(screen.getByText("使用 3日 / 残 7日")).toBeInTheDocument();
    });
  });

  describe("支給セクション", () => {
    it("「支給」セクションヘッダーが表示される", () => {
      const record = createMockRecord();

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("支給")).toBeInTheDocument();
    });

    it("基本給が通貨形式で表示される", () => {
      const record = createMockRecord({ baseSalary: 300000 });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("基本給")).toBeInTheDocument();
      // Intl.NumberFormat による通貨形式（￥は全角）
      expect(screen.getByText("￥300,000")).toBeInTheDocument();
    });

    it("各種手当が表示される", () => {
      const record = createMockRecord({
        fixedOvertimeAllowance: 50000,
        overtimeAllowance: 15000,
        over60OvertimeAllowance: 5000,
        nightAllowance: 3000,
        specialAllowance: 10000,
        expenseReimbursement: 5000,
        commuteAllowance: 10000,
        stockIncentive: 2000,
      });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("固定時間外手当")).toBeInTheDocument();
      expect(screen.getByText("残業手当")).toBeInTheDocument();
      expect(screen.getByText("残業手当(60h超)")).toBeInTheDocument();
      expect(screen.getByText("深夜割増額")).toBeInTheDocument();
      expect(screen.getByText("特別手当")).toBeInTheDocument();
      expect(screen.getByText("立替経費")).toBeInTheDocument();
      expect(screen.getByText("非課税通勤費")).toBeInTheDocument();
      expect(screen.getByText("持株会奨励金")).toBeInTheDocument();
    });

    it("支給合計が表示される", () => {
      const record = createMockRecord({ totalEarnings: 400000 });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("支給合計")).toBeInTheDocument();
      expect(screen.getByText("￥400,000")).toBeInTheDocument();
    });
  });

  describe("控除セクション", () => {
    it("「控除」セクションヘッダーが表示される", () => {
      const record = createMockRecord();

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("控除")).toBeInTheDocument();
    });

    it("各種控除項目が表示される", () => {
      const record = createMockRecord({
        healthInsurance: 15000,
        pensionInsurance: 28000,
        employmentInsurance: 2000,
        residentTax: 20000,
        incomeTax: 10000,
        stockContribution: 5000,
      });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("健康保険料")).toBeInTheDocument();
      expect(screen.getByText("厚生年金保険")).toBeInTheDocument();
      expect(screen.getByText("雇用保険料")).toBeInTheDocument();
      expect(screen.getByText("住民税")).toBeInTheDocument();
      expect(screen.getByText("所得税")).toBeInTheDocument();
      expect(screen.getByText("持株会拠出金")).toBeInTheDocument();
    });

    it("控除合計が表示される", () => {
      const record = createMockRecord({ totalDeductions: 80000 });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("控除合計")).toBeInTheDocument();
      expect(screen.getByText("￥80,000")).toBeInTheDocument();
    });
  });

  describe("差引支給額セクション", () => {
    it("差引支給額が表示される", () => {
      const record = createMockRecord({ netSalary: 320000 });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      expect(screen.getByText("差引支給額")).toBeInTheDocument();
      expect(screen.getByText("￥320,000")).toBeInTheDocument();
    });
  });

  describe("モーダル操作", () => {
    it("閉じるボタンをクリックすると onClose が呼ばれる", () => {
      const record = createMockRecord();

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      fireEvent.click(screen.getByRole("button", { name: "閉じる" }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("エッジケース", () => {
    it("残業時間が0分の場合、0時間0分と表示される", () => {
      const record = createMockRecord({
        extraOvertimeMinutes: 0,
        over60OvertimeMinutes: 0,
        nightOvertimeMinutes: 0,
      });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      // 3つの0時間0分が表示される
      const zeroTimeTexts = screen.getAllByText("0時間0分");
      expect(zeroTimeTexts.length).toBe(3);
    });

    it("金額が0の場合、￥0と表示される", () => {
      const record = createMockRecord({
        specialAllowance: 0,
        expenseReimbursement: 0,
        stockIncentive: 0,
        stockContribution: 0,
      });

      render(<PayslipDetailModal record={record} onClose={mockOnClose} />);

      // ￥0（全角）が複数表示される
      const zeroAmounts = screen.getAllByText("￥0");
      expect(zeroAmounts.length).toBeGreaterThanOrEqual(4);
    });
  });
});
