import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import type { RouteObject } from "react-router";
import type { ActionData, PayslipFormData } from "../schema";
import type { Route } from "../+types/route";

// モック関数をホイストして作成
const { mockHandleFileUpload, mockHandleSavePayslip } = vi.hoisted(() => ({
  mockHandleFileUpload: vi.fn(),
  mockHandleSavePayslip: vi.fn(),
}));

// server.ts をモック
vi.mock("../server", () => ({
  handleFileUpload: mockHandleFileUpload,
  handleSavePayslip: mockHandleSavePayslip,
}));

// モックの後にインポート
import PayslipUpload, { action } from "../route";

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

// useActionData をモックしてコンポーネントをレンダリング
function renderWithActionData(actionData: ActionData | null) {
  // react-router の hooks をモックするために、カスタムルーターを使用
  const routes: RouteObject[] = [
    {
      path: "/",
      Component: PayslipUpload as React.ComponentType,
      // action の結果をシミュレート
      action: () => actionData,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/"],
    hydrationData: {
      actionData: {
        "0": actionData,
      },
      loaderData: {},
    },
  });

  return render(<RouterProvider router={router} />);
}

// action 関数をテストするためのヘルパー
function createActionArgs(request: Request): Route.ActionArgs {
  return {
    request,
    params: {},
    context: {},
  } as Route.ActionArgs;
}

describe("action 関数", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("intent=upload の場合、handleFileUpload を呼び出す", async () => {
    const mockResult: ActionData = {
      step: "confirm",
      data: createMockFormData(),
      fileName: "test.pdf",
    };
    mockHandleFileUpload.mockResolvedValue(mockResult);

    const formData = new FormData();
    formData.set("intent", "upload");
    formData.set(
      "file",
      new File(["content"], "test.pdf", { type: "application/pdf" })
    );

    const request = new Request("http://localhost/payslips/upload", {
      method: "POST",
      body: formData,
    });

    const result = await action(createActionArgs(request));

    expect(mockHandleFileUpload).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
  });

  it("intent=save の場合、handleSavePayslip を呼び出す", async () => {
    const mockResult: ActionData = {
      success: true,
      message: "給与明細を保存しました",
    };
    mockHandleSavePayslip.mockResolvedValue(mockResult);

    const formData = new FormData();
    formData.set("intent", "save");
    formData.set("year", "2025");
    formData.set("month", "6");

    const request = new Request("http://localhost/payslips/upload", {
      method: "POST",
      body: formData,
    });

    const result = await action(createActionArgs(request));

    expect(mockHandleSavePayslip).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
  });

  it("不正な intent の場合、エラーを返す", async () => {
    const formData = new FormData();
    formData.set("intent", "invalid");

    const request = new Request("http://localhost/payslips/upload", {
      method: "POST",
      body: formData,
    });

    const result = await action(createActionArgs(request));

    expect(result).toEqual({
      success: false,
      error: "不正なリクエストです",
    });
    expect(mockHandleFileUpload).not.toHaveBeenCalled();
    expect(mockHandleSavePayslip).not.toHaveBeenCalled();
  });

  it("intent が未指定の場合、エラーを返す", async () => {
    const formData = new FormData();

    const request = new Request("http://localhost/payslips/upload", {
      method: "POST",
      body: formData,
    });

    const result = await action(createActionArgs(request));

    expect(result).toEqual({
      success: false,
      error: "不正なリクエストです",
    });
  });
});

describe("PayslipUpload コンポーネント", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態: アップロード画面を表示する", () => {
    renderWithActionData(null);

    expect(screen.getByText("給与明細アップロード")).toBeInTheDocument();
    expect(
      screen.getByText("画像またはPDFファイルをアップロードしてください")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /アップロード/ })
    ).toBeInTheDocument();
  });

  it("確認画面: step=confirm の場合、ConfirmationForm を表示する", () => {
    const actionData: ActionData = {
      step: "confirm",
      data: createMockFormData(),
      fileName: "test.pdf",
    };

    renderWithActionData(actionData);

    expect(screen.getByText("内容の確認・修正")).toBeInTheDocument();
    expect(
      screen.getByText("アップロードされたファイル: test.pdf")
    ).toBeInTheDocument();
  });

  it("成功画面: success=true の場合、SuccessCard を表示する", () => {
    const actionData: ActionData = {
      success: true,
      message: "給与明細を保存しました",
    };

    renderWithActionData(actionData);

    expect(screen.getByText("保存完了")).toBeInTheDocument();
    expect(screen.getByText("給与明細を保存しました")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "続けてアップロード" })
    ).toBeInTheDocument();
  });

  it("エラー時: アップロード画面でエラーメッセージを表示する", () => {
    const actionData: ActionData = {
      success: false,
      error: "ファイルが選択されていません",
    };

    renderWithActionData(actionData);

    // アップロード画面が表示される
    expect(screen.getByText("給与明細アップロード")).toBeInTheDocument();
    // エラーメッセージが表示される
    expect(
      screen.getByText("ファイルが選択されていません")
    ).toBeInTheDocument();
  });

  it("ファイル未選択時、アップロードボタンが無効", () => {
    renderWithActionData(null);

    const uploadButton = screen.getByRole("button", { name: /アップロード/ });
    expect(uploadButton).toBeDisabled();
  });
});
