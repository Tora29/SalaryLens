import { describe, it, expect } from "vitest";

import { salaryRecordSchema, MESSAGES } from "../schema";

// 正常なレコードデータ
const validRecord = {
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
};

describe("salaryRecordSchema", () => {
  describe("正常系", () => {
    it("有効なレコードをパースできる", () => {
      const result = salaryRecordSchema.safeParse(validRecord);
      expect(result.success).toBe(true);
    });

    it("month が 1 の場合（境界値下限）", () => {
      const result = salaryRecordSchema.safeParse({ ...validRecord, month: 1 });
      expect(result.success).toBe(true);
    });

    it("month が 12 の場合（境界値上限）", () => {
      const result = salaryRecordSchema.safeParse({
        ...validRecord,
        month: 12,
      });
      expect(result.success).toBe(true);
    });

    it("netSalary が負の値でも有効（差引支給額は負になりうる）", () => {
      const result = salaryRecordSchema.safeParse({
        ...validRecord,
        netSalary: -50000,
      });
      expect(result.success).toBe(true);
    });

    it("各フィールドが 0 でも有効", () => {
      const zeroRecord = {
        ...validRecord,
        extraOvertimeMinutes: 0,
        overtimeAllowance: 0,
        healthInsurance: 0,
      };
      const result = salaryRecordSchema.safeParse(zeroRecord);
      expect(result.success).toBe(true);
    });
  });

  describe("異常系", () => {
    it("month が 0 の場合は無効", () => {
      const result = salaryRecordSchema.safeParse({ ...validRecord, month: 0 });
      expect(result.success).toBe(false);
    });

    it("month が 13 の場合は無効", () => {
      const result = salaryRecordSchema.safeParse({
        ...validRecord,
        month: 13,
      });
      expect(result.success).toBe(false);
    });

    it("nonnegative フィールドに負の値を指定した場合は無効", () => {
      const result = salaryRecordSchema.safeParse({
        ...validRecord,
        baseSalary: -1,
      });
      expect(result.success).toBe(false);
    });

    it("必須フィールドが欠けている場合は無効", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- id を除外するために分割代入を使用
      const { id: _, ...withoutId } = validRecord;
      const result = salaryRecordSchema.safeParse(withoutId);
      expect(result.success).toBe(false);
    });

    it("フィールドの型が不正な場合は無効", () => {
      const result = salaryRecordSchema.safeParse({
        ...validRecord,
        year: "2024", // string は無効
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("MESSAGES", () => {
  it("エラーメッセージが定義されている", () => {
    expect(MESSAGES.error.invalidDataFormat).toBe("データ形式が不正です");
  });

  it("空のレコードメッセージが定義されている", () => {
    expect(MESSAGES.empty.noRecords).toBe("給与明細がありません");
  });

  it("特定年の空メッセージが関数として動作する", () => {
    expect(MESSAGES.empty.noRecordsForYear(2024)).toBe(
      "2024年の給与明細がありません"
    );
  });
});
