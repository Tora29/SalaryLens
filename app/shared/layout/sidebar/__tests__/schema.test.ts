import { describe, it, expect } from "vitest";

import { themeSchema, navigationItemSchema } from "../schema";

describe("themeSchema", () => {
  it("light を有効な値として受け入れる", () => {
    const result = themeSchema.safeParse("light");

    expect(result.success).toBe(true);
    expect(result.data).toBe("light");
  });

  it("dark を有効な値として受け入れる", () => {
    const result = themeSchema.safeParse("dark");

    expect(result.success).toBe(true);
    expect(result.data).toBe("dark");
  });

  it("無効なテーマ値を拒否する", () => {
    const result = themeSchema.safeParse("invalid");

    expect(result.success).toBe(false);
  });

  it("空文字列を拒否する", () => {
    const result = themeSchema.safeParse("");

    expect(result.success).toBe(false);
  });

  it("null を拒否する", () => {
    const result = themeSchema.safeParse(null);

    expect(result.success).toBe(false);
  });
});

describe("navigationItemSchema", () => {
  const validItem = {
    id: "1",
    path: "/dashboard",
    label: "ダッシュボード",
    iconName: "LayoutDashboard",
    sortOrder: 1,
    isActive: true,
  };

  it("有効なナビゲーション項目を受け入れる", () => {
    const result = navigationItemSchema.safeParse(validItem);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validItem);
  });

  it("id が欠けている場合は拒否する", () => {
    const { id: _id, ...itemWithoutId } = validItem;
    void _id;
    const result = navigationItemSchema.safeParse(itemWithoutId);

    expect(result.success).toBe(false);
  });

  it("path が欠けている場合は拒否する", () => {
    const { path: _path, ...itemWithoutPath } = validItem;
    void _path;
    const result = navigationItemSchema.safeParse(itemWithoutPath);

    expect(result.success).toBe(false);
  });

  it("label が欠けている場合は拒否する", () => {
    const { label: _label, ...itemWithoutLabel } = validItem;
    void _label;
    const result = navigationItemSchema.safeParse(itemWithoutLabel);

    expect(result.success).toBe(false);
  });

  it("iconName が欠けている場合は拒否する", () => {
    const { iconName: _iconName, ...itemWithoutIconName } = validItem;
    void _iconName;
    const result = navigationItemSchema.safeParse(itemWithoutIconName);

    expect(result.success).toBe(false);
  });

  it("sortOrder が欠けている場合は拒否する", () => {
    const { sortOrder: _sortOrder, ...itemWithoutSortOrder } = validItem;
    void _sortOrder;
    const result = navigationItemSchema.safeParse(itemWithoutSortOrder);

    expect(result.success).toBe(false);
  });

  it("isActive が欠けている場合は拒否する", () => {
    const { isActive: _isActive, ...itemWithoutIsActive } = validItem;
    void _isActive;
    const result = navigationItemSchema.safeParse(itemWithoutIsActive);

    expect(result.success).toBe(false);
  });

  it("sortOrder が数値でない場合は拒否する", () => {
    const result = navigationItemSchema.safeParse({
      ...validItem,
      sortOrder: "not a number",
    });

    expect(result.success).toBe(false);
  });

  it("isActive が boolean でない場合は拒否する", () => {
    const result = navigationItemSchema.safeParse({
      ...validItem,
      isActive: "true",
    });

    expect(result.success).toBe(false);
  });
});
