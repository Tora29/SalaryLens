import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SalaryRecord } from "../../../../prisma/generated/prisma/client";
import { getDashboardData } from "../server";

// モック関数をホイストして作成（vi.mock より先に評価される）
const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn<() => Promise<SalaryRecord[]>>(),
}));

// Prisma クライアントをモック
vi.mock("~/shared/lib/db.server", () => ({
  prisma: {
    salaryRecord: {
      findMany: mockFindMany,
    },
  },
}));

// テスト用の DB レコード作成ヘルパー
const createDbRecord = (
  overrides: Partial<SalaryRecord> = {}
): SalaryRecord => ({
  id: "test-id",
  year: 2025,
  month: 1,
  baseSalary: 300000,
  overtime: 50000,
  bonus: 0,
  deductions: 50000,
  netSalary: 300000,
  fixedOvertimeHours: 20,
  extraOvertimeHours: 5,
  over60OvertimeHours: 0,
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
      createDbRecord({ id: "1", month: 1, netSalary: 300000, bonus: 0 }),
      createDbRecord({ id: "2", month: 2, netSalary: 350000, bonus: 100000 }),
      createDbRecord({ id: "3", month: 3, netSalary: 320000, bonus: 0 }),
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
    expect(result.summary.totalBonus).toBe(100000);

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

    // Act & Assert
    await expect(getDashboardData()).rejects.toBeDefined();
  });
});
