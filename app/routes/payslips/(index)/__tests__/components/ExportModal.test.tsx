import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { ExportModal } from "../../components/ExportModal";
import type { SalaryRecord } from "../../schema";

// Modalコンポーネントをモック
vi.mock("~/shared/components/Modal", () => ({
  Modal: ({
    title,
    onClose,
    children,
    footer,
  }: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
  }) => (
    <div data-testid="modal" role="dialog" aria-label={title}>
      <h2>{title}</h2>
      <button onClick={onClose} aria-label="閉じる">
        閉じる
      </button>
      {children}
      {footer && <div data-testid="modal-footer">{footer}</div>}
    </div>
  ),
}));

// URL.createObjectURL と URL.revokeObjectURL をモック
const mockCreateObjectURL = vi.fn(() => "blob:mock-url");
const mockRevokeObjectURL = vi.fn();

/**
 * テスト用のモックレコードを生成
 */
function createMockRecord(overrides: Partial<SalaryRecord> = {}): SalaryRecord {
  return {
    id: "test-id",
    year: 2024,
    month: 1,
    extraOvertimeMinutes: 60,
    over60OvertimeMinutes: 0,
    nightOvertimeMinutes: 30,
    paidLeaveDays: 1,
    paidLeaveRemainingDays: 10,
    baseSalary: 300000,
    fixedOvertimeAllowance: 50000,
    overtimeAllowance: 10000,
    over60OvertimeAllowance: 0,
    nightAllowance: 2000,
    specialAllowance: 0,
    expenseReimbursement: 0,
    commuteAllowance: 10000,
    stockIncentive: 0,
    totalEarnings: 372000,
    healthInsurance: 15000,
    pensionInsurance: 28000,
    employmentInsurance: 2000,
    residentTax: 20000,
    incomeTax: 10000,
    stockContribution: 0,
    totalDeductions: 75000,
    netSalary: 297000,
    ...overrides,
  };
}

describe("ExportModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // グローバルオブジェクトをモック
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("モーダル基本表示", () => {
    it("タイトル「CSV出力」が表示される", () => {
      const records = [createMockRecord()];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(
        screen.getByRole("dialog", { name: "CSV出力" })
      ).toBeInTheDocument();
    });

    it("説明文が表示される", () => {
      const records = [createMockRecord()];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(
        screen.getByText("出力範囲を選択してください")
      ).toBeInTheDocument();
    });

    it("キャンセルボタンが表示される", () => {
      const records = [createMockRecord()];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(
        screen.getByRole("button", { name: "キャンセル" })
      ).toBeInTheDocument();
    });

    it("出力ボタンが表示される", () => {
      const records = [createMockRecord()];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole("button", { name: /出力/ })).toBeInTheDocument();
    });
  });

  describe("範囲選択ラジオボタン（全件表示時）", () => {
    it("isAllYears が true の場合、「全件」オプションが表示される", () => {
      const records = [
        createMockRecord({ year: 2024, month: 1 }),
        createMockRecord({ year: 2023, month: 12 }),
      ];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("全件")).toBeInTheDocument();
    });

    it("isAllYears が true の場合、「年を指定」オプションが表示される", () => {
      const records = [
        createMockRecord({ year: 2024, month: 1 }),
        createMockRecord({ year: 2023, month: 12 }),
      ];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("年を指定")).toBeInTheDocument();
    });

    it("「月を指定」オプションが常に表示される", () => {
      const records = [createMockRecord()];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("月を指定")).toBeInTheDocument();
    });

    it("デフォルトで「全件」が選択されている", () => {
      const records = [createMockRecord()];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      const allRadio = screen.getByRole("radio", { name: /全件/ });
      expect(allRadio).toBeChecked();
    });
  });

  describe("範囲選択ラジオボタン（年指定時）", () => {
    it("isAllYears が false の場合、「{年}年の全件」が表示される", () => {
      const records = [
        createMockRecord({ year: 2024, month: 1 }),
        createMockRecord({ year: 2024, month: 2 }),
      ];

      render(
        <ExportModal
          isAllYears={false}
          selectedYear={2024}
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("2024年の全件")).toBeInTheDocument();
    });

    it("isAllYears が false の場合、「年を指定」オプションは表示されない", () => {
      const records = [createMockRecord({ year: 2024 })];

      render(
        <ExportModal
          isAllYears={false}
          selectedYear={2024}
          records={records}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByText("年を指定")).not.toBeInTheDocument();
    });
  });

  describe("年選択セレクトボックス", () => {
    it("「年を指定」を選択すると、年選択セレクトボックスが表示される", () => {
      const records = [
        createMockRecord({ year: 2024, month: 1 }),
        createMockRecord({ year: 2023, month: 12 }),
      ];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      // 「年を指定」を選択
      fireEvent.click(screen.getByRole("radio", { name: /年を指定/ }));

      // 年セレクトボックスが表示される（ラベルテキストで確認）
      expect(screen.getByText("年")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("利用可能な年がオプションとして表示される", () => {
      const records = [
        createMockRecord({ id: "1", year: 2024, month: 1 }),
        createMockRecord({ id: "2", year: 2023, month: 6 }),
        createMockRecord({ id: "3", year: 2022, month: 12 }),
      ];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      // 「年を指定」を選択
      fireEvent.click(screen.getByRole("radio", { name: /年を指定/ }));

      expect(
        screen.getByRole("option", { name: "2024年" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "2023年" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "2022年" })
      ).toBeInTheDocument();
    });
  });

  describe("月選択セレクトボックス", () => {
    it("「月を指定」を選択すると、年と月の選択が表示される", () => {
      const records = [
        createMockRecord({ year: 2024, month: 1 }),
        createMockRecord({ year: 2024, month: 6 }),
      ];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      // 「月を指定」を選択
      fireEvent.click(screen.getByRole("radio", { name: /月を指定/ }));

      // 年と月のセレクトボックスが表示される
      const selects = screen.getAllByRole("combobox");
      expect(selects.length).toBe(2);
    });

    it("選択した年に対応する月がオプションとして表示される", () => {
      const records = [
        createMockRecord({ id: "1", year: 2024, month: 1 }),
        createMockRecord({ id: "2", year: 2024, month: 3 }),
        createMockRecord({ id: "3", year: 2024, month: 6 }),
      ];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      // 「月を指定」を選択
      fireEvent.click(screen.getByRole("radio", { name: /月を指定/ }));

      // 月のオプションが表示される（昇順）
      expect(screen.getByRole("option", { name: "1月" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "3月" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "6月" })).toBeInTheDocument();
    });
  });

  describe("モーダル操作", () => {
    it("キャンセルボタンをクリックすると onClose が呼ばれる", () => {
      const records = [createMockRecord()];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "キャンセル" }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("閉じるボタンをクリックすると onClose が呼ばれる", () => {
      const records = [createMockRecord()];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "閉じる" }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("CSVエクスポート", () => {
    it("出力ボタンをクリックするとCSVファイルがダウンロードされる", () => {
      const records = [createMockRecord()];

      // document.createElement をスパイ（他の要素の作成を妨げないよう条件付き）
      const originalCreateElement = document.createElement.bind(document);
      const mockClick = vi.fn();
      vi.spyOn(document, "createElement").mockImplementation((tagName) => {
        if (tagName === "a") {
          return {
            href: "",
            download: "",
            click: mockClick,
          } as unknown as HTMLAnchorElement;
        }
        return originalCreateElement(tagName);
      });

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /出力/ }));

      // ダウンロードリンクがクリックされる
      expect(mockClick).toHaveBeenCalled();
      // Blobが作成される
      expect(mockCreateObjectURL).toHaveBeenCalled();
      // URLが解放される
      expect(mockRevokeObjectURL).toHaveBeenCalled();
      // モーダルが閉じる
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("対象レコードがない場合、ダウンロードが実行されない", () => {
      const records: SalaryRecord[] = [];

      const originalCreateElement = document.createElement.bind(document);
      const mockClick = vi.fn();
      vi.spyOn(document, "createElement").mockImplementation((tagName) => {
        if (tagName === "a") {
          return {
            href: "",
            download: "",
            click: mockClick,
          } as unknown as HTMLAnchorElement;
        }
        return originalCreateElement(tagName);
      });

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /出力/ }));

      // ダウンロードは実行されない
      expect(mockClick).not.toHaveBeenCalled();
      // モーダルも閉じない
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("範囲タイプ変更時の動作", () => {
    it("「全件」を選択すると、年・月選択が非表示になる", () => {
      const records = [
        createMockRecord({ year: 2024, month: 1 }),
        createMockRecord({ year: 2023, month: 12 }),
      ];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      // 「月を指定」を選択
      fireEvent.click(screen.getByRole("radio", { name: /月を指定/ }));
      expect(screen.getAllByRole("combobox").length).toBe(2);

      // 「全件」を選択
      fireEvent.click(screen.getByRole("radio", { name: /全件/ }));
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("「年を指定」を選択すると、最新年がデフォルト選択される", () => {
      const records = [
        createMockRecord({ id: "1", year: 2024, month: 1 }),
        createMockRecord({ id: "2", year: 2023, month: 12 }),
        createMockRecord({ id: "3", year: 2022, month: 6 }),
      ];

      render(
        <ExportModal
          isAllYears={true}
          selectedYear="all"
          records={records}
          onClose={mockOnClose}
        />
      );

      // 「年を指定」を選択
      fireEvent.click(screen.getByRole("radio", { name: /年を指定/ }));

      // 最新年（2024）がデフォルト選択される
      const yearSelect = screen.getByRole("combobox");
      expect(yearSelect).toHaveValue("2024");
    });
  });
});
