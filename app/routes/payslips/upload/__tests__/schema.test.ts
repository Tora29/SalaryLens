import { describe, it, expect } from "vitest";
import {
  payslipSchema,
  ALLOWED_FILE_TYPES,
  PDF_LABEL_MAPPINGS,
} from "../schema";
import type { PayslipData } from "../schema";

// テスト用の有効なデータ作成ヘルパー
const createValidPayslipData = (
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

describe("payslipSchema", () => {
  describe("正常系", () => {
    it("有効なデータを検証できる", () => {
      const data = createValidPayslipData();
      const result = payslipSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.year).toBe(2025);
        expect(result.data.month).toBe(6);
        expect(result.data.baseSalary).toBe(300000);
      }
    });

    it("文字列の数値を coerce で変換できる", () => {
      const data = {
        ...createValidPayslipData(),
        year: "2025",
        month: "6",
        baseSalary: "300000",
      };
      const result = payslipSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.year).toBe(2025);
        expect(result.data.month).toBe(6);
        expect(result.data.baseSalary).toBe(300000);
      }
    });

    it("すべてのフィールドが 0 でも有効", () => {
      const data: PayslipData = {
        year: 2025,
        month: 1,
        extraOvertimeMinutes: 0,
        over60OvertimeMinutes: 0,
        nightOvertimeMinutes: 0,
        paidLeaveDays: 0,
        paidLeaveRemainingDays: 0,
        baseSalary: 0,
        fixedOvertimeAllowance: 0,
        overtimeAllowance: 0,
        over60OvertimeAllowance: 0,
        nightAllowance: 0,
        specialAllowance: 0,
        expenseReimbursement: 0,
        commuteAllowance: 0,
        stockIncentive: 0,
        totalEarnings: 0,
        healthInsurance: 0,
        pensionInsurance: 0,
        employmentInsurance: 0,
        residentTax: 0,
        incomeTax: 0,
        stockContribution: 0,
        totalDeductions: 0,
        netSalary: 0,
      };
      const result = payslipSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe("年のバリデーション", () => {
    it("境界値: year が 2000 は有効", () => {
      const data = createValidPayslipData({ year: 2000 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("境界値: year が 2100 は有効", () => {
      const data = createValidPayslipData({ year: 2100 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("異常系: year が 1999 は無効", () => {
      const data = createValidPayslipData({ year: 1999 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("異常系: year が 2101 は無効", () => {
      const data = createValidPayslipData({ year: 2101 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("月のバリデーション", () => {
    it("境界値: month が 1 は有効", () => {
      const data = createValidPayslipData({ month: 1 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("境界値: month が 12 は有効", () => {
      const data = createValidPayslipData({ month: 12 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("異常系: month が 0 は無効", () => {
      const data = createValidPayslipData({ month: 0 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("異常系: month が 13 は無効", () => {
      const data = createValidPayslipData({ month: 13 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("金額フィールドのバリデーション", () => {
    it("異常系: 負の金額は無効", () => {
      const data = createValidPayslipData({ baseSalary: -1 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("異常系: 負の控除額は無効", () => {
      const data = createValidPayslipData({ healthInsurance: -100 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("勤怠フィールドのバリデーション", () => {
    it("異常系: 負の残業時間は無効", () => {
      const data = createValidPayslipData({ extraOvertimeMinutes: -1 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("異常系: 負の有休日数は無効", () => {
      const data = createValidPayslipData({ paidLeaveDays: -1 });
      const result = payslipSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});

describe("ALLOWED_FILE_TYPES", () => {
  it("PDF と画像形式が含まれている", () => {
    expect(ALLOWED_FILE_TYPES).toContain("application/pdf");
    expect(ALLOWED_FILE_TYPES).toContain("image/png");
    expect(ALLOWED_FILE_TYPES).toContain("image/jpeg");
    expect(ALLOWED_FILE_TYPES).toContain("image/jpg");
  });

  it("許可されていない形式は含まれていない", () => {
    expect(ALLOWED_FILE_TYPES).not.toContain("image/gif");
    expect(ALLOWED_FILE_TYPES).not.toContain("text/plain");
  });
});

describe("PDF_LABEL_MAPPINGS", () => {
  it("勤怠ラベルが正しくマッピングされている", () => {
    expect(PDF_LABEL_MAPPINGS["固定外残業時間"]).toEqual({
      field: "extraOvertimeMinutes",
      type: "time",
    });
    expect(PDF_LABEL_MAPPINGS["有休日数"]).toEqual({
      field: "paidLeaveDays",
      type: "decimal",
    });
  });

  it("支給ラベルが正しくマッピングされている", () => {
    expect(PDF_LABEL_MAPPINGS["基本給(月給)"]).toEqual({
      field: "baseSalary",
      type: "currency",
    });
    expect(PDF_LABEL_MAPPINGS["残業手当"]).toEqual({
      field: "overtimeAllowance",
      type: "currency",
    });
  });

  it("控除ラベルが正しくマッピングされている", () => {
    expect(PDF_LABEL_MAPPINGS["健康保険料"]).toEqual({
      field: "healthInsurance",
      type: "currency",
    });
    expect(PDF_LABEL_MAPPINGS["所得税"]).toEqual({
      field: "incomeTax",
      type: "currency",
    });
  });

  it("差引支給額ラベルが正しくマッピングされている", () => {
    expect(PDF_LABEL_MAPPINGS["差引支給額:"]).toEqual({
      field: "netSalary",
      type: "currency",
    });
  });
});
