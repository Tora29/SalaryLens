import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import PayslipsList, { ErrorBoundary } from "../route";
import type { Route } from "../+types/route";
import type { SalaryRecord } from "../schema";

// 共有コンポーネントをモック
vi.mock("~/shared/components/EmptyState", () => ({
  EmptyState: ({
    message,
    icon: Icon,
  }: {
    message: string;
    icon: React.ComponentType;
  }) => (
    <div data-testid="empty-state">
      <Icon />
      <span>{message}</span>
    </div>
  ),
}));

vi.mock("~/shared/components/PageLayout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  ),
}));

vi.mock("~/shared/components/RouteErrorBoundary", () => ({
  RouteErrorBoundary: ({ error }: { error: unknown }) => (
    <div data-testid="error-boundary">
      {error instanceof Error ? error.message : "Unknown error"}
    </div>
  ),
}));

// ローカルコンポーネントをモック
vi.mock("../components/PageHeader", () => ({
  PageHeader: ({
    recordsCount,
    selectedYear,
    availableYears,
  }: {
    recordsCount: number;
    selectedYear: number | "all";
    availableYears: number[];
  }) => (
    <div data-testid="page-header">
      <span data-testid="records-count">{recordsCount}</span>
      <span data-testid="selected-year">{selectedYear}</span>
      <span data-testid="available-years">{availableYears.join(",")}</span>
    </div>
  ),
}));

vi.mock("../components/PayslipsTable", () => ({
  PayslipsTable: ({
    records,
    isAllYears,
  }: {
    records: SalaryRecord[];
    isAllYears: boolean;
  }) => (
    <div data-testid="payslips-table">
      <span data-testid="table-records-count">{records.length}</span>
      <span data-testid="is-all-years">{isAllYears.toString()}</span>
    </div>
  ),
}));

vi.mock("../components/PayslipDetailModal", () => ({
  PayslipDetailModal: ({
    record,
    onClose,
  }: {
    record: SalaryRecord;
    onClose: () => void;
  }) => (
    <div data-testid="detail-modal">
      <span data-testid="detail-record-id">{record.id}</span>
      <button onClick={onClose}>閉じる</button>
    </div>
  ),
}));

vi.mock("../components/ExportModal", () => ({
  ExportModal: ({
    isAllYears,
    selectedYear,
    onClose,
  }: {
    isAllYears: boolean;
    selectedYear: number | "all";
    onClose: () => void;
  }) => (
    <div data-testid="export-modal">
      <span data-testid="export-is-all-years">{isAllYears.toString()}</span>
      <span data-testid="export-selected-year">{selectedYear}</span>
      <button onClick={onClose}>閉じる</button>
    </div>
  ),
}));

/**
 * テスト用のモックレコードを生成
 */
function createMockRecord(overrides: Partial<SalaryRecord> = {}): SalaryRecord {
  return {
    id: "test-id-1",
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

/**
 * テスト用のヘルパー：loaderData のみを受け取り、必須の params と matches をモック
 */
function createMockComponentProps(
  loaderData: Route.ComponentProps["loaderData"]
): Route.ComponentProps {
  return {
    loaderData,
    params: {},
    matches: [] as unknown as Route.ComponentProps["matches"],
  };
}

/**
 * MemoryRouterでラップしてレンダリング
 */
function renderWithRouter(
  ui: React.ReactElement,
  { initialEntries = ["/payslips"] } = {}
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  );
}

describe("PayslipsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("レコードがある場合", () => {
    it("PageHeader と PayslipsTable が表示される", () => {
      const records = [
        createMockRecord({ id: "1", year: 2024, month: 1 }),
        createMockRecord({ id: "2", year: 2024, month: 2 }),
      ];
      const loaderData = {
        records,
        selectedYear: 2024 as number | "all",
        availableYears: [2024, 2023],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />
      );

      expect(screen.getByTestId("page-header")).toBeInTheDocument();
      expect(screen.getByTestId("payslips-table")).toBeInTheDocument();
      expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
    });

    it("レコード件数が PageHeader に渡される", () => {
      const records = [
        createMockRecord({ id: "1" }),
        createMockRecord({ id: "2" }),
        createMockRecord({ id: "3" }),
      ];
      const loaderData = {
        records,
        selectedYear: 2024 as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />
      );

      expect(screen.getByTestId("records-count")).toHaveTextContent("3");
    });

    it("selectedYear が PayslipsTable に isAllYears として渡される", () => {
      const records = [createMockRecord()];
      const loaderData = {
        records,
        selectedYear: "all" as number | "all",
        availableYears: [2024, 2023],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />
      );

      expect(screen.getByTestId("is-all-years")).toHaveTextContent("true");
    });

    it("selectedYear が数値の場合、isAllYears は false", () => {
      const records = [createMockRecord()];
      const loaderData = {
        records,
        selectedYear: 2024 as number | "all",
        availableYears: [2024, 2023],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />
      );

      expect(screen.getByTestId("is-all-years")).toHaveTextContent("false");
    });
  });

  describe("レコードがない場合", () => {
    it("EmptyState が表示される", () => {
      const loaderData = {
        records: [],
        selectedYear: 2024 as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />
      );

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.queryByTestId("payslips-table")).not.toBeInTheDocument();
    });

    it("全件表示の場合、汎用メッセージが表示される", () => {
      const loaderData = {
        records: [],
        selectedYear: "all" as number | "all",
        availableYears: [],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />
      );

      expect(screen.getByTestId("empty-state")).toHaveTextContent(
        "給与明細がありません"
      );
    });

    it("年指定の場合、年を含むメッセージが表示される", () => {
      const loaderData = {
        records: [],
        selectedYear: 2024 as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />
      );

      expect(screen.getByTestId("empty-state")).toHaveTextContent(
        "2024年の給与明細がありません"
      );
    });
  });

  describe("詳細モーダル", () => {
    it("URLに detail パラメータがない場合、詳細モーダルは表示されない", () => {
      const records = [createMockRecord({ id: "test-1" })];
      const loaderData = {
        records,
        selectedYear: 2024 as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />,
        { initialEntries: ["/payslips"] }
      );

      expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();
    });

    it("URLに detail パラメータがある場合、詳細モーダルが表示される", () => {
      const records = [createMockRecord({ id: "test-1" })];
      const loaderData = {
        records,
        selectedYear: 2024 as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />,
        { initialEntries: ["/payslips?detail=test-1"] }
      );

      expect(screen.getByTestId("detail-modal")).toBeInTheDocument();
      expect(screen.getByTestId("detail-record-id")).toHaveTextContent(
        "test-1"
      );
    });

    it("存在しないレコードIDの場合、詳細モーダルは表示されない", () => {
      const records = [createMockRecord({ id: "test-1" })];
      const loaderData = {
        records,
        selectedYear: 2024 as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />,
        { initialEntries: ["/payslips?detail=nonexistent"] }
      );

      expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();
    });
  });

  describe("エクスポートモーダル", () => {
    it("URLに modal=export がない場合、エクスポートモーダルは表示されない", () => {
      const records = [createMockRecord()];
      const loaderData = {
        records,
        selectedYear: 2024 as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />,
        { initialEntries: ["/payslips"] }
      );

      expect(screen.queryByTestId("export-modal")).not.toBeInTheDocument();
    });

    it("URLに modal=export がある場合、エクスポートモーダルが表示される", () => {
      const records = [createMockRecord()];
      const loaderData = {
        records,
        selectedYear: 2024 as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />,
        { initialEntries: ["/payslips?modal=export"] }
      );

      expect(screen.getByTestId("export-modal")).toBeInTheDocument();
    });

    it("エクスポートモーダルに isAllYears が正しく渡される", () => {
      const records = [createMockRecord()];
      const loaderData = {
        records,
        selectedYear: "all" as number | "all",
        availableYears: [2024],
      };

      renderWithRouter(
        <PayslipsList {...createMockComponentProps(loaderData)} />,
        { initialEntries: ["/payslips?modal=export"] }
      );

      expect(screen.getByTestId("export-is-all-years")).toHaveTextContent(
        "true"
      );
    });
  });
});

describe("ErrorBoundary", () => {
  it("エラーメッセージが表示される", () => {
    const error = new Error("Test error message");

    render(
      <ErrorBoundary
        error={error}
        params={{}}
        loaderData={undefined}
        actionData={undefined}
      />
    );

    expect(screen.getByTestId("error-boundary")).toHaveTextContent(
      "Test error message"
    );
  });
});
