import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Navigation } from "../../../../prisma/generated/prisma/client";
import { getActiveNavigationItems, getAllNavigationItems } from "../server";

// モック関数をホイストして作成
const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn<() => Promise<Navigation[]>>(),
}));

// Prisma クライアントをモック
vi.mock("~/shared/lib/db.server", () => ({
  prisma: {
    navigation: {
      findMany: mockFindMany,
    },
  },
}));

// テスト用の DB レコード作成ヘルパー
const createDbRecord = (overrides: Partial<Navigation> = {}): Navigation => ({
  id: "test-id",
  path: "/test",
  label: "テスト",
  iconName: "FileText",
  sortOrder: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("getActiveNavigationItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("有効なナビゲーション項目を sortOrder 順で取得する", async () => {
    // Arrange
    const mockRecords = [
      createDbRecord({ id: "1", path: "/dashboard", sortOrder: 1 }),
      createDbRecord({ id: "2", path: "/upload", sortOrder: 2 }),
    ];
    mockFindMany.mockResolvedValue(mockRecords);

    // Act
    const result = await getActiveNavigationItems();

    // Assert
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    expect(result).toHaveLength(2);
    expect(result[0].path).toBe("/dashboard");
    expect(result[1].path).toBe("/upload");
  });

  it("空の場合は空配列を返す", async () => {
    // Arrange
    mockFindMany.mockResolvedValue([]);

    // Act
    const result = await getActiveNavigationItems();

    // Assert
    expect(result).toEqual([]);
  });

  it("DB エラーが発生した場合は例外をスローする", async () => {
    // Arrange
    mockFindMany.mockRejectedValue(new Error("Database connection failed"));

    // Act & Assert
    await expect(getActiveNavigationItems()).rejects.toThrow(
      "Database connection failed"
    );
  });
});

describe("getAllNavigationItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("全てのナビゲーション項目を sortOrder 順で取得する", async () => {
    // Arrange
    const mockRecords = [
      createDbRecord({ id: "1", sortOrder: 1, isActive: true }),
      createDbRecord({ id: "2", sortOrder: 2, isActive: false }),
      createDbRecord({ id: "3", sortOrder: 3, isActive: true }),
    ];
    mockFindMany.mockResolvedValue(mockRecords);

    // Act
    const result = await getAllNavigationItems();

    // Assert
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { sortOrder: "asc" },
    });
    expect(result).toHaveLength(3);
  });

  it("空の場合は空配列を返す", async () => {
    // Arrange
    mockFindMany.mockResolvedValue([]);

    // Act
    const result = await getAllNavigationItems();

    // Assert
    expect(result).toEqual([]);
  });

  it("DB エラーが発生した場合は例外をスローする", async () => {
    // Arrange
    mockFindMany.mockRejectedValue(new Error("Database connection failed"));

    // Act & Assert
    await expect(getAllNavigationItems()).rejects.toThrow(
      "Database connection failed"
    );
  });
});
