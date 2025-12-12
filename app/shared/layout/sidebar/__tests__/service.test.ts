import { describe, it, expect } from "vitest";
import { LayoutDashboard, FileText } from "lucide-react";

import {
  getIconByName,
  mapNavigationItemsWithIcons,
  getNextTheme,
  createThemeCookieValue,
} from "../service";
import type { NavigationItem } from "../schema";

describe("getIconByName", () => {
  it("登録済みのアイコン名に対して正しいアイコンを返す", () => {
    const icon = getIconByName("LayoutDashboard");

    expect(icon).toBe(LayoutDashboard);
  });

  it("未登録のアイコン名に対してデフォルトアイコンを返す", () => {
    const icon = getIconByName("UnknownIcon");

    expect(icon).toBe(FileText);
  });

  it("空文字列に対してデフォルトアイコンを返す", () => {
    const icon = getIconByName("");

    expect(icon).toBe(FileText);
  });
});

describe("mapNavigationItemsWithIcons", () => {
  it("ナビゲーション項目にアイコンコンポーネントを付与する", () => {
    const items: NavigationItem[] = [
      {
        id: "1",
        path: "/dashboard",
        label: "ダッシュボード",
        iconName: "LayoutDashboard",
        sortOrder: 1,
        isActive: true,
      },
    ];

    const result = mapNavigationItemsWithIcons(items);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "1",
      path: "/dashboard",
      label: "ダッシュボード",
      iconName: "LayoutDashboard",
      sortOrder: 1,
      isActive: true,
    });
    expect(result[0].icon).toBe(LayoutDashboard);
  });

  it("空配列に対して空配列を返す", () => {
    const result = mapNavigationItemsWithIcons([]);

    expect(result).toEqual([]);
  });

  it("未登録のアイコン名の場合はデフォルトアイコンを付与する", () => {
    const items: NavigationItem[] = [
      {
        id: "1",
        path: "/unknown",
        label: "不明",
        iconName: "UnknownIcon",
        sortOrder: 1,
        isActive: true,
      },
    ];

    const result = mapNavigationItemsWithIcons(items);

    expect(result[0].icon).toBe(FileText);
  });
});

describe("getNextTheme", () => {
  it("dark テーマの場合は light を返す", () => {
    const result = getNextTheme("dark");

    expect(result).toBe("light");
  });

  it("light テーマの場合は dark を返す", () => {
    const result = getNextTheme("light");

    expect(result).toBe("dark");
  });
});

describe("createThemeCookieValue", () => {
  it("light テーマの Cookie 値を生成する", () => {
    const result = createThemeCookieValue("light");

    expect(result).toBe("theme=light; Path=/; SameSite=Lax; Max-Age=31536000");
  });

  it("dark テーマの Cookie 値を生成する", () => {
    const result = createThemeCookieValue("dark");

    expect(result).toBe("theme=dark; Path=/; SameSite=Lax; Max-Age=31536000");
  });
});
