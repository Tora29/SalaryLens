import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfirmationForm } from "../../components/ConfirmationForm";
import type { PayslipFormData, ActionData } from "../../schema";
import { createMemoryRouter, RouterProvider } from "react-router";

// react-router の Form コンポーネントを使用するためのラッパー
function renderWithRouter(ui: React.ReactElement) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: ui,
      },
    ],
    { initialEntries: ["/"] }
  );
  return render(<RouterProvider router={router} />);
}

// テスト用のモックデータ
const createMockFormData = (
  overrides: Partial<PayslipFormData> = {}
): PayslipFormData => ({
  year: 2025,
  month: 6,
  extraOvertimeMinutes: "1:30",
  over60OvertimeMinutes: "0:00",
  nightOvertimeMinutes: "0:30",
  paidLeaveDays: 1,
  paidLeaveRemainingDays: 10,
  baseSalary: "300,000",
  fixedOvertimeAllowance: "100,000",
  overtimeAllowance: "30,000",
  over60OvertimeAllowance: "0",
  nightAllowance: "5,000",
  specialAllowance: "10,000",
  expenseReimbursement: "0",
  commuteAllowance: "10,000",
  stockIncentive: "0",
  totalEarnings: "455,000",
  healthInsurance: "20,000",
  pensionInsurance: "40,000",
  employmentInsurance: "3,000",
  residentTax: "15,000",
  incomeTax: "30,000",
  stockContribution: "0",
  totalDeductions: "108,000",
  netSalary: "347,000",
  ...overrides,
});

describe("ConfirmationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常系: ヘッダーとファイル名を表示する", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    expect(screen.getByText("内容の確認・修正")).toBeInTheDocument();
    expect(
      screen.getByText("アップロードされたファイル: test.pdf")
    ).toBeInTheDocument();
  });

  it("正常系: 基本情報セクションを表示する", () => {
    const data = createMockFormData({ year: 2025, month: 11 });
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    expect(screen.getByText("基本情報")).toBeInTheDocument();
    expect(screen.getByLabelText("年")).toHaveValue(2025);
    expect(screen.getByLabelText("月")).toHaveValue(11);
  });

  it("正常系: 勤怠セクションを表示する", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    expect(screen.getByText("勤怠")).toBeInTheDocument();
    expect(screen.getByLabelText("固定外残業時間")).toHaveValue("1:30");
    expect(screen.getByLabelText("深夜割増時間")).toHaveValue("0:30");
    expect(screen.getByLabelText("有休日数")).toHaveValue(1);
    expect(screen.getByLabelText("有休残日数")).toHaveValue(10);
  });

  it("正常系: 支給セクションを表示する", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    expect(screen.getByText("支給")).toBeInTheDocument();
    expect(screen.getByLabelText("基本給")).toHaveValue("300,000");
    expect(screen.getByLabelText("固定時間外手当")).toHaveValue("100,000");
    expect(screen.getByLabelText("支給合計")).toHaveValue("455,000");
  });

  it("正常系: 控除セクションを表示する", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    expect(screen.getByText("控除")).toBeInTheDocument();
    expect(screen.getByLabelText("健康保険料")).toHaveValue("20,000");
    expect(screen.getByLabelText("所得税")).toHaveValue("30,000");
    expect(screen.getByLabelText("控除合計")).toHaveValue("108,000");
  });

  it("正常系: 差引支給額セクションを表示する", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    expect(
      screen.getByRole("heading", { name: "差引支給額" })
    ).toBeInTheDocument();
    // 差引支給額のラベルとフィールド
    expect(screen.getByLabelText("差引支給額")).toHaveValue("347,000");
  });

  it("正常系: 保存ボタンとキャンセルリンクを表示する", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "キャンセル" })).toHaveAttribute(
      "href",
      "/payslips/upload"
    );
  });

  it("正常系: 送信中は保存ボタンが無効になり、ローディング表示になる", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={true}
        actionData={actionData}
      />
    );

    const submitButton = screen.getByRole("button", { name: /保存中/ });
    expect(submitButton).toBeDisabled();
  });

  it("異常系: エラーがある場合はエラーメッセージを表示する", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      success: false,
      error: "入力内容に誤りがあります",
    };

    renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    expect(screen.getByText("入力内容に誤りがあります")).toBeInTheDocument();
  });

  it("正常系: hidden フィールドに intent=save が設定されている", () => {
    const data = createMockFormData();
    const actionData: ActionData = {
      step: "confirm",
      data,
      fileName: "test.pdf",
    };

    const { container } = renderWithRouter(
      <ConfirmationForm
        data={data}
        fileName="test.pdf"
        isSubmitting={false}
        actionData={actionData}
      />
    );

    const hiddenInput = container.querySelector('input[name="intent"]');
    expect(hiddenInput).toHaveValue("save");
  });
});
