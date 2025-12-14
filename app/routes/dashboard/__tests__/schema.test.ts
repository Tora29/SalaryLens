import { describe, it, expect } from "vitest";
import {
  salaryRecordSchema,
  summaryDataSchema,
  loaderDataSchema,
} from "../schema";

// テスト用の有効なデータ
const validSalaryRecord = {
  id: "test-id-123",
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
};

const validSummaryData = {
  totalNetSalary: 3621600,
  averageNetSalary: 301800,
  totalEarnings: 4596000,
  totalDeductions: 974400,
  yearOverYearChange: 3.5,
};

describe("salaryRecordSchema", () => {
  describe("正常系", () => {
    it("有効なデータをパースできる", () => {
      const result = salaryRecordSchema.safeParse(validSalaryRecord);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("test-id-123");
        expect(result.data.year).toBe(2025);
        expect(result.data.month).toBe(1);
      }
    });

    it("月の境界値（1月）をパースできる", () => {
      const data = { ...validSalaryRecord, month: 1 };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("月の境界値（12月）をパースできる", () => {
      const data = { ...validSalaryRecord, month: 12 };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("netSalaryが負の値でもパースできる", () => {
      // 控除が支給を上回るケース
      const data = { ...validSalaryRecord, netSalary: -50000 };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("数値が0でもパースできる", () => {
      const data = {
        ...validSalaryRecord,
        extraOvertimeMinutes: 0,
        overtimeAllowance: 0,
        specialAllowance: 0,
      };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("異常系", () => {
    it("月が0の場合はエラー", () => {
      const data = { ...validSalaryRecord, month: 0 };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("month");
      }
    });

    it("月が13の場合はエラー", () => {
      const data = { ...validSalaryRecord, month: 13 };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("month");
      }
    });

    it("残業時間が負の値の場合はエラー", () => {
      const data = { ...validSalaryRecord, extraOvertimeMinutes: -10 };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("extraOvertimeMinutes");
      }
    });

    it("基本給が負の値の場合はエラー", () => {
      const data = { ...validSalaryRecord, baseSalary: -100000 };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("baseSalary");
      }
    });

    it("必須フィールドが欠けている場合はエラー", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- 分割代入で意図的に除外
      const { id, ...dataWithoutId } = validSalaryRecord;
      const result = salaryRecordSchema.safeParse(dataWithoutId);
      expect(result.success).toBe(false);
    });

    it("型が異なる場合はエラー", () => {
      const data = { ...validSalaryRecord, year: "2025" };
      const result = salaryRecordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("year");
      }
    });
  });
});

describe("summaryDataSchema", () => {
  describe("正常系", () => {
    it("有効なデータをパースできる", () => {
      const result = summaryDataSchema.safeParse(validSummaryData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.totalNetSalary).toBe(3621600);
        expect(result.data.yearOverYearChange).toBe(3.5);
      }
    });

    it("前年比が負の値でもパースできる", () => {
      const data = { ...validSummaryData, yearOverYearChange: -5.2 };
      const result = summaryDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("全ての値が0でもパースできる", () => {
      const data = {
        totalNetSalary: 0,
        averageNetSalary: 0,
        totalEarnings: 0,
        totalDeductions: 0,
        yearOverYearChange: 0,
      };
      const result = summaryDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("異常系", () => {
    it("必須フィールドが欠けている場合はエラー", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- 分割代入で意図的に除外
      const { totalNetSalary, ...dataWithoutTotal } = validSummaryData;
      const result = summaryDataSchema.safeParse(dataWithoutTotal);
      expect(result.success).toBe(false);
    });
  });
});

describe("loaderDataSchema", () => {
  describe("正常系", () => {
    it("有効なデータをパースできる", () => {
      const data = {
        summary: validSummaryData,
        monthlySalaries: [validSalaryRecord],
        recentRecords: [validSalaryRecord],
      };
      const result = loaderDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("空の配列でもパースできる", () => {
      const data = {
        summary: validSummaryData,
        monthlySalaries: [],
        recentRecords: [],
      };
      const result = loaderDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("複数のレコードをパースできる", () => {
      const record2 = { ...validSalaryRecord, id: "test-id-456", month: 2 };
      const data = {
        summary: validSummaryData,
        monthlySalaries: [validSalaryRecord, record2],
        recentRecords: [record2, validSalaryRecord],
      };
      const result = loaderDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.monthlySalaries).toHaveLength(2);
        expect(result.data.recentRecords).toHaveLength(2);
      }
    });
  });

  describe("異常系", () => {
    it("summaryが不正な場合はエラー", () => {
      const data = {
        summary: { invalid: "data" },
        monthlySalaries: [validSalaryRecord],
        recentRecords: [validSalaryRecord],
      };
      const result = loaderDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("monthlySalariesに不正なレコードがある場合はエラー", () => {
      const invalidRecord = { ...validSalaryRecord, month: 13 };
      const data = {
        summary: validSummaryData,
        monthlySalaries: [validSalaryRecord, invalidRecord],
        recentRecords: [validSalaryRecord],
      };
      const result = loaderDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
