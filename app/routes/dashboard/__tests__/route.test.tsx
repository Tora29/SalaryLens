import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard, { ErrorBoundary } from "../route";
import type { Route } from "../+types/route";

// テスト用のヘルパー：loaderData のみを受け取り、必須の params と matches をモックする
function createMockComponentProps(
  loaderData: Route.ComponentProps["loaderData"]
): Route.ComponentProps {
  return {
    loaderData,
    params: {},
    matches: [] as unknown as Route.ComponentProps["matches"],
  };
}

// ErrorBoundary 用のヘルパー
function createMockErrorBoundaryProps(
  error: unknown
): Route.ErrorBoundaryProps {
  return {
    error,
    params: {},
  };
}

// recharts のモック（SSR環境でのエラー回避）
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  ComposedChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="composed-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

// テスト用のモックデータ
const mockLoaderData = {
  summary: {
    totalNetSalary: 3621600,
    averageNetSalary: 301800,
    totalEarnings: 4596000,
    totalDeductions: 974400,
    yearOverYearChange: 3.5,
  },
  monthlySalaries: [
    {
      id: "test-id-1",
      year: 2025,
      month: 1,
      extraOvertimeMinutes: 120,
      over60OvertimeMinutes: 0,
      nightOvertimeMinutes: 30,
      paidLeaveDays: 1.5,
      paidLeaveRemainingDays: 10.5,
      baseSalary: 300000,
      fixedOvertimeAllowance: 50000,
      overtimeAllowance: 10000,
      over60OvertimeAllowance: 0,
      nightAllowance: 2000,
      specialAllowance: 0,
      expenseReimbursement: 5000,
      commuteAllowance: 15000,
      stockIncentive: 1000,
      totalEarnings: 383000,
      healthInsurance: 15000,
      pensionInsurance: 27000,
      employmentInsurance: 1200,
      residentTax: 20000,
      incomeTax: 8000,
      stockContribution: 10000,
      totalDeductions: 81200,
      netSalary: 301800,
    },
  ],
  recentRecords: [
    {
      id: "test-id-1",
      year: 2025,
      month: 1,
      extraOvertimeMinutes: 120,
      over60OvertimeMinutes: 0,
      nightOvertimeMinutes: 30,
      paidLeaveDays: 1.5,
      paidLeaveRemainingDays: 10.5,
      baseSalary: 300000,
      fixedOvertimeAllowance: 50000,
      overtimeAllowance: 10000,
      over60OvertimeAllowance: 0,
      nightAllowance: 2000,
      specialAllowance: 0,
      expenseReimbursement: 5000,
      commuteAllowance: 15000,
      stockIncentive: 1000,
      totalEarnings: 383000,
      healthInsurance: 15000,
      pensionInsurance: 27000,
      employmentInsurance: 1200,
      residentTax: 20000,
      incomeTax: 8000,
      stockContribution: 10000,
      totalDeductions: 81200,
      netSalary: 301800,
    },
  ],
};

describe("Dashboard", () => {
  describe("正常系", () => {
    it("ヘッダーが表示される", () => {
      render(<Dashboard {...createMockComponentProps(mockLoaderData)} />);

      expect(screen.getByText("ダッシュボード")).toBeInTheDocument();
      expect(screen.getByText("あなたの給与データの概要")).toBeInTheDocument();
    });

    it("サマリーカードが4つ表示される", () => {
      render(<Dashboard {...createMockComponentProps(mockLoaderData)} />);

      expect(screen.getByText("年間手取り合計")).toBeInTheDocument();
      expect(screen.getByText("平均月収")).toBeInTheDocument();
      expect(screen.getByText("年間控除合計")).toBeInTheDocument();
      expect(screen.getByText("今月の手取り")).toBeInTheDocument();
    });

    it("給与チャートセクションが表示される", () => {
      render(<Dashboard {...createMockComponentProps(mockLoaderData)} />);

      expect(screen.getByText("月別給与推移")).toBeInTheDocument();
    });

    it("最近の給与明細セクションが表示される", () => {
      render(<Dashboard {...createMockComponentProps(mockLoaderData)} />);

      expect(screen.getByText("最近の給与明細")).toBeInTheDocument();
    });

    it("前年比トレンドが表示される", () => {
      render(<Dashboard {...createMockComponentProps(mockLoaderData)} />);

      // 3.5% の前年比
      expect(screen.getByText("3.5%")).toBeInTheDocument();
      expect(screen.getByText("vs 前年")).toBeInTheDocument();
    });
  });

  describe("エッジケース", () => {
    it("データが空の場合でもクラッシュしない", () => {
      const emptyData = {
        summary: {
          totalNetSalary: 0,
          averageNetSalary: 0,
          totalEarnings: 0,
          totalDeductions: 0,
          yearOverYearChange: 0,
        },
        monthlySalaries:
          [] as Route.ComponentProps["loaderData"]["monthlySalaries"],
        recentRecords:
          [] as Route.ComponentProps["loaderData"]["recentRecords"],
      };

      render(<Dashboard {...createMockComponentProps(emptyData)} />);

      expect(screen.getByText("ダッシュボード")).toBeInTheDocument();
    });
  });
});

describe("ErrorBoundary", () => {
  describe("RouteErrorResponse の場合", () => {
    it("ステータスコードとメッセージを表示する", () => {
      // isRouteErrorResponse が true を返すエラーオブジェクト
      const routeError = {
        status: 404,
        statusText: "Not Found",
        data: "ページが見つかりません",
        internal: false,
      };

      render(<ErrorBoundary {...createMockErrorBoundaryProps(routeError)} />);

      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByText("ページが見つかりません")).toBeInTheDocument();
    });

    it("500エラーを表示する", () => {
      const serverError = {
        status: 500,
        statusText: "Internal Server Error",
        data: "データ形式が不正です",
        internal: false,
      };

      render(<ErrorBoundary {...createMockErrorBoundaryProps(serverError)} />);

      expect(screen.getByText("500")).toBeInTheDocument();
      expect(screen.getByText("データ形式が不正です")).toBeInTheDocument();
    });
  });

  describe("予期しないエラーの場合", () => {
    it("汎用エラーメッセージを表示する", () => {
      const unexpectedError = new Error("Something went wrong");

      render(
        <ErrorBoundary {...createMockErrorBoundaryProps(unexpectedError)} />
      );

      expect(screen.getByText("エラー")).toBeInTheDocument();
      expect(
        screen.getByText("予期しないエラーが発生しました")
      ).toBeInTheDocument();
    });
  });
});
