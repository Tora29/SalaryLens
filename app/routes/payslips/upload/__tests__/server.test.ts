import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PayslipData } from "../schema";

// モック関数をホイストして作成
const { mockCreate, mockParsePdfPayslip } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockParsePdfPayslip: vi.fn<(buffer: Buffer) => Promise<PayslipData>>(),
}));

// Prisma クライアントをモック
vi.mock("~/shared/lib/db.server", () => ({
  prisma: {
    salary: {
      create: mockCreate,
    },
  },
}));

// PDF パーサーをモック
vi.mock("../util-pdf-parser.server", () => ({
  parsePdfPayslip: mockParsePdfPayslip,
}));

// モックの後にインポート
import { handleFileUpload, handleSavePayslip } from "../server";

// テスト用のモックデータ作成ヘルパー
const createMockParsedData = (
  overrides: Partial<PayslipData> = {}
): PayslipData => ({
  year: 2025,
  month: 6,
  extraOvertimeMinutes: 90,
  over60OvertimeMinutes: 0,
  nightOvertimeMinutes: 30,
  paidLeaveDays: 1,
  paidLeaveRemainingDays: 10,
  baseSalary: 300000,
  fixedOvertimeAllowance: 100000,
  overtimeAllowance: 30000,
  over60OvertimeAllowance: 0,
  nightAllowance: 5000,
  specialAllowance: 10000,
  expenseReimbursement: 0,
  commuteAllowance: 10000,
  stockIncentive: 0,
  totalEarnings: 455000,
  healthInsurance: 20000,
  pensionInsurance: 40000,
  employmentInsurance: 3000,
  residentTax: 15000,
  incomeTax: 30000,
  stockContribution: 0,
  totalDeductions: 108000,
  netSalary: 347000,
  ...overrides,
});

// テスト用の File オブジェクト作成ヘルパー
function createMockFile(content: string, name: string, type: string): File {
  const blob = new Blob([content], { type });
  const file = new File([blob], name, { type });
  return file;
}

// arrayBuffer メソッドを持つモック File を作成
function createMockPdfFile(name: string): File {
  const content = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
  const blob = new Blob([content], { type: "application/pdf" });
  const file = new File([blob], name, { type: "application/pdf" });

  // Node.js環境で arrayBuffer をモック
  Object.defineProperty(file, "arrayBuffer", {
    value: () => Promise.resolve(content.buffer),
  });

  return file;
}

describe("handleFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("異常系: ファイルバリデーション", () => {
    it("ファイルが null の場合はエラーを返す", async () => {
      const result = await handleFileUpload(null);

      expect(result).toEqual({
        success: false,
        error: "ファイルが選択されていません",
      });
    });

    it("ファイルサイズが 0 の場合はエラーを返す", async () => {
      const emptyFile = createMockFile("", "empty.pdf", "application/pdf");

      const result = await handleFileUpload(emptyFile);

      expect(result).toEqual({
        success: false,
        error: "ファイルが選択されていません",
      });
    });

    it("許可されていないファイル形式の場合はエラーを返す", async () => {
      const textFile = createMockFile("content", "test.txt", "text/plain");

      const result = await handleFileUpload(textFile);

      expect(result).toEqual({
        success: false,
        error: "PDF または画像ファイル（PNG, JPG）を選択してください",
      });
    });
  });

  describe("正常系: PDF ファイル", () => {
    it("PDF ファイルを解析して確認画面データを返す", async () => {
      const mockData = createMockParsedData();
      mockParsePdfPayslip.mockResolvedValue(mockData);

      const pdfFile = createMockPdfFile("test.pdf");

      const result = await handleFileUpload(pdfFile);

      expect(result).toHaveProperty("step", "confirm");
      expect(result).toHaveProperty("fileName", "test.pdf");
      expect(result).toHaveProperty("data");

      if ("data" in result) {
        // 時間フィールドは HH:MM 形式に変換される
        expect(result.data.extraOvertimeMinutes).toBe("1:30");
        expect(result.data.nightOvertimeMinutes).toBe("0:30");

        // 金額フィールドはカンマ区切りに変換される
        expect(result.data.baseSalary).toBe("300,000");
        expect(result.data.netSalary).toBe("347,000");
      }
    });

    it("PDF 解析エラー時はデフォルト値で続行する", async () => {
      mockParsePdfPayslip.mockRejectedValue(new Error("Parse error"));

      const pdfFile = createMockPdfFile("test.pdf");

      const result = await handleFileUpload(pdfFile);

      expect(result).toHaveProperty("step", "confirm");
      expect(result).toHaveProperty("fileName", "test.pdf");
      if ("data" in result) {
        // デフォルト値（0）が設定される
        expect(result.data.baseSalary).toBe("0");
      }
    });
  });

  describe("正常系: 画像ファイル", () => {
    it("PNG ファイルはデフォルト値で確認画面を返す", async () => {
      const pngFile = createMockFile("png content", "test.png", "image/png");

      const result = await handleFileUpload(pngFile);

      expect(result).toHaveProperty("step", "confirm");
      expect(result).toHaveProperty("fileName", "test.png");
      if ("data" in result) {
        expect(result.data.baseSalary).toBe("0");
      }
    });

    it("JPEG ファイルはデフォルト値で確認画面を返す", async () => {
      const jpegFile = createMockFile("jpeg content", "test.jpg", "image/jpeg");

      const result = await handleFileUpload(jpegFile);

      expect(result).toHaveProperty("step", "confirm");
      expect(result).toHaveProperty("fileName", "test.jpg");
    });
  });
});

describe("handleSavePayslip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常系: 有効なデータを保存できる", async () => {
    mockCreate.mockResolvedValue({ id: "new-id" });

    const formData = new FormData();
    formData.set("year", "2025");
    formData.set("month", "6");
    formData.set("extraOvertimeMinutes", "1:30");
    formData.set("over60OvertimeMinutes", "0:00");
    formData.set("nightOvertimeMinutes", "0:30");
    formData.set("paidLeaveDays", "1");
    formData.set("paidLeaveRemainingDays", "10");
    formData.set("baseSalary", "300,000");
    formData.set("fixedOvertimeAllowance", "100,000");
    formData.set("overtimeAllowance", "30,000");
    formData.set("over60OvertimeAllowance", "0");
    formData.set("nightAllowance", "5,000");
    formData.set("specialAllowance", "10,000");
    formData.set("expenseReimbursement", "0");
    formData.set("commuteAllowance", "10,000");
    formData.set("stockIncentive", "0");
    formData.set("totalEarnings", "455,000");
    formData.set("healthInsurance", "20,000");
    formData.set("pensionInsurance", "40,000");
    formData.set("employmentInsurance", "3,000");
    formData.set("residentTax", "15,000");
    formData.set("incomeTax", "30,000");
    formData.set("stockContribution", "0");
    formData.set("totalDeductions", "108,000");
    formData.set("netSalary", "347,000");

    const result = await handleSavePayslip(formData);

    expect(result).toEqual({
      success: true,
      message: "給与明細を保存しました",
    });
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("異常系: バリデーションエラーの場合はエラーを返す", async () => {
    const formData = new FormData();
    // 無効な月
    formData.set("year", "2025");
    formData.set("month", "13");
    formData.set("extraOvertimeMinutes", "0:00");
    formData.set("over60OvertimeMinutes", "0:00");
    formData.set("nightOvertimeMinutes", "0:00");
    formData.set("paidLeaveDays", "0");
    formData.set("paidLeaveRemainingDays", "0");
    formData.set("baseSalary", "0");
    formData.set("fixedOvertimeAllowance", "0");
    formData.set("overtimeAllowance", "0");
    formData.set("over60OvertimeAllowance", "0");
    formData.set("nightAllowance", "0");
    formData.set("specialAllowance", "0");
    formData.set("expenseReimbursement", "0");
    formData.set("commuteAllowance", "0");
    formData.set("stockIncentive", "0");
    formData.set("totalEarnings", "0");
    formData.set("healthInsurance", "0");
    formData.set("pensionInsurance", "0");
    formData.set("employmentInsurance", "0");
    formData.set("residentTax", "0");
    formData.set("incomeTax", "0");
    formData.set("stockContribution", "0");
    formData.set("totalDeductions", "0");
    formData.set("netSalary", "0");

    const result = await handleSavePayslip(formData);

    expect(result).toEqual({
      success: false,
      error: "入力内容に誤りがあります",
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
