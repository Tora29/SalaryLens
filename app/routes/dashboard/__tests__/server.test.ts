import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Salary } from "../../../../prisma/generated/prisma/client";
import { Decimal } from "../../../../prisma/generated/prisma/internal/prismaNamespace";
import { getDashboardData } from "../server";

// モック関数をホイストして作成（vi.mock より先に評価される）
const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn<() => Promise<Salary[]>>(),
}));

// Prisma クライアントをモック
vi.mock("~/shared/lib/db.server", () => ({
  prisma: {
    salary: {
      findMany: mockFindMany,
    },
  },
}));

// テスト用の DB レコード作成ヘルパー
const createDbRecord = (overrides: Partial<Salary> = {}): Salary => ({
  id: "test-id",
  year: 2025,
  month: 1,

  // 勤怠
  extraOvertimeMinutes: 900,
  over60OvertimeMinutes: 0,
  nightOvertimeMinutes: 0,
  paidLeaveDays: new Decimal(1.0),
  paidLeaveRemainingDays: new Decimal(10.0),

  // 支給
  baseSalary: 300000,
  fixedOvertimeAllowance: 100000,
  overtimeAllowance: 30000,
  over60OvertimeAllowance: 0,
  nightAllowance: 0,
  specialAllowance: 10000,
  expenseReimbursement: 0,
  commuteAllowance: 10000,
  stockIncentive: 0,
  totalEarnings: 450000,

  // 控除
  healthInsurance: 20000,
  pensionInsurance: 40000,
  employmentInsurance: 3000,
  residentTax: 15000,
  incomeTax: 30000,
  stockContribution: 0,
  totalDeductions: 108000,

  // 差引支給額
  netSalary: 342000,

  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("getDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常系: DB から取得したデータをダッシュボード用に変換できる", async () => {
    // Arrange
    const mockDbRecords = [
      createDbRecord({
        id: "1",
        month: 1,
        netSalary: 300000,
        totalEarnings: 450000,
      }),
      createDbRecord({
        id: "2",
        month: 2,
        netSalary: 350000,
        totalEarnings: 500000,
      }),
      createDbRecord({
        id: "3",
        month: 3,
        netSalary: 320000,
        totalEarnings: 470000,
      }),
    ];
    mockFindMany.mockResolvedValue(mockDbRecords);

    // Act
    const result = await getDashboardData();

    // Assert
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    // サマリーの検証
    expect(result.summary.totalNetSalary).toBe(970000);
    expect(result.summary.totalEarnings).toBe(1420000);

    // 月別給与の検証
    expect(result.monthlySalaries).toHaveLength(3);

    // 直近レコードの検証（逆順で最大5件）
    expect(result.recentRecords).toHaveLength(3);
    expect(result.recentRecords[0].id).toBe("3");
  });

  it("正常系: 空のデータベースの場合は空の結果を返す", async () => {
    // Arrange
    mockFindMany.mockResolvedValue([]);

    // Act
    const result = await getDashboardData();

    // Assert
    expect(result.summary.totalNetSalary).toBe(0);
    expect(result.summary.averageNetSalary).toBe(0);
    expect(result.monthlySalaries).toHaveLength(0);
    expect(result.recentRecords).toHaveLength(0);
  });

  it("正常系: 5件以上のレコードがある場合、recentRecords は5件まで", async () => {
    // Arrange
    const mockDbRecords = Array.from({ length: 10 }, (_, i) =>
      createDbRecord({ id: `${i + 1}`, month: i + 1 })
    );
    mockFindMany.mockResolvedValue(mockDbRecords);

    // Act
    const result = await getDashboardData();

    // Assert
    expect(result.monthlySalaries).toHaveLength(10);
    expect(result.recentRecords).toHaveLength(5);
  });

  it("異常系: DB エラーが発生した場合は例外をスローする", async () => {
    // Arrange
    mockFindMany.mockRejectedValue(new Error("Database connection failed"));

    // Act & Assert
    await expect(getDashboardData()).rejects.toThrow(
      "Database connection failed"
    );
  });

  it("異常系: zod バリデーション失敗時はエラーをスローする", async () => {
    // Arrange: 不正なデータ（month: 13 は schema で max(12) 違反）
    const invalidRecord = createDbRecord({ month: 13 });
    mockFindMany.mockResolvedValue([invalidRecord]);

    // console.error の出力を抑制（テスト対象の意図的なエラー）
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Act & Assert
    await expect(getDashboardData()).rejects.toBeDefined();

    // 実際にエラーログが呼ばれたことを確認
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
