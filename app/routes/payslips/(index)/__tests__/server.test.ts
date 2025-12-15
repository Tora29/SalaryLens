import { describe, it, expect, vi, beforeEach } from "vitest";

import { getLoaderData } from "../server";

// モック関数をホイストして作成（vi.mock より先に評価される）
const { mockGroupBy, mockFindMany } = vi.hoisted(() => ({
  mockGroupBy: vi.fn(),
  mockFindMany: vi.fn(),
}));

// Prisma クライアントをモック
vi.mock("~/shared/lib/db.server", () => ({
  prisma: {
    salary: {
      groupBy: mockGroupBy,
      findMany: mockFindMany,
    },
  },
}));

// Decimal のモック（Number() で数値に変換可能なオブジェクト）
function createMockDecimal(value: number) {
  return {
    valueOf: () => value,
    toString: () => String(value),
    [Symbol.toPrimitive]: () => value,
  };
}

// テスト用のDB生データ（Prisma から返ってくる形式）
function createDbRecord(
  overrides: Partial<{
    id: string;
    year: number;
    month: number;
    paidLeaveDays: ReturnType<typeof createMockDecimal>;
    paidLeaveRemainingDays: ReturnType<typeof createMockDecimal>;
  }> = {}
) {
  return {
    id: "test-id",
    year: 2024,
    month: 1,
    extraOvertimeMinutes: 0,
    over60OvertimeMinutes: 0,
    nightOvertimeMinutes: 0,
    paidLeaveDays: createMockDecimal(0),
    paidLeaveRemainingDays: createMockDecimal(10),
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
    ...overrides,
  };
}

describe("getLoaderData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常系: 年指定なしの場合、最新年のレコードを返す", async () => {
    // モックの設定
    mockGroupBy.mockResolvedValue([
      {
        year: 2024,
        _count: null,
        _sum: null,
        _avg: null,
        _min: null,
        _max: null,
      },
      {
        year: 2023,
        _count: null,
        _sum: null,
        _avg: null,
        _min: null,
        _max: null,
      },
    ]);
    mockFindMany.mockResolvedValue([
      createDbRecord({ id: "1", month: 1 }),
      createDbRecord({ id: "2", month: 2 }),
    ]);

    const request = new Request("http://localhost/payslips");
    const result = await getLoaderData(request);

    expect(result.availableYears).toEqual([2024, 2023]);
    expect(result.selectedYear).toBe(2024);
    expect(result.records).toHaveLength(2);
    // Decimal が number に変換されていることを確認
    expect(typeof result.records[0]?.paidLeaveDays).toBe("number");
  });

  it("正常系: year=all の場合、全年のレコードを返す", async () => {
    mockGroupBy.mockResolvedValue([
      {
        year: 2024,
        _count: null,
        _sum: null,
        _avg: null,
        _min: null,
        _max: null,
      },
      {
        year: 2023,
        _count: null,
        _sum: null,
        _avg: null,
        _min: null,
        _max: null,
      },
    ]);
    mockFindMany.mockResolvedValue([
      createDbRecord({ id: "1", year: 2023, month: 12 }),
      createDbRecord({ id: "2", year: 2024, month: 1 }),
    ]);

    const request = new Request("http://localhost/payslips?year=all");
    const result = await getLoaderData(request);

    expect(result.selectedYear).toBe("all");
    expect(result.records).toHaveLength(2);
  });

  it("正常系: 特定年を指定した場合、その年のレコードを返す", async () => {
    mockGroupBy.mockResolvedValue([
      {
        year: 2024,
        _count: null,
        _sum: null,
        _avg: null,
        _min: null,
        _max: null,
      },
      {
        year: 2023,
        _count: null,
        _sum: null,
        _avg: null,
        _min: null,
        _max: null,
      },
    ]);
    mockFindMany.mockResolvedValue([
      createDbRecord({ id: "1", year: 2023, month: 1 }),
    ]);

    const request = new Request("http://localhost/payslips?year=2023");
    const result = await getLoaderData(request);

    expect(result.selectedYear).toBe(2023);
  });

  it("境界値: データがない場合、空配列を返す", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockFindMany.mockResolvedValue([]);

    const request = new Request("http://localhost/payslips");
    const result = await getLoaderData(request);

    expect(result.availableYears).toEqual([]);
    expect(result.records).toEqual([]);
    // selectedYear はデフォルトで今年になる
    expect(result.selectedYear).toBe(new Date().getFullYear());
  });

  it("異常系: バリデーション失敗時はエラーをスローする", async () => {
    mockGroupBy.mockResolvedValue([
      {
        year: 2024,
        _count: null,
        _sum: null,
        _avg: null,
        _min: null,
        _max: null,
      },
    ]);
    // 不正なデータ（month が範囲外）
    mockFindMany.mockResolvedValue([
      {
        ...createDbRecord(),
        month: 13, // 不正値
      },
    ]);

    // console.error の出力を抑制
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = new Request("http://localhost/payslips");

    await expect(getLoaderData(request)).rejects.toBeDefined();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
