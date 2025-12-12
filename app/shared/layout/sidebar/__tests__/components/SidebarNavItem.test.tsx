import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { LayoutDashboard } from "lucide-react";
import { SidebarNavItem } from "../../components/SidebarNavItem";
import type { NavigationItemWithIcon } from "../../schema";

// テスト用のナビゲーション項目を作成するヘルパー
const createNavItem = (
  overrides: Partial<NavigationItemWithIcon> = {}
): NavigationItemWithIcon => ({
  id: "test-id",
  path: "/dashboard",
  label: "ダッシュボード",
  iconName: "LayoutDashboard",
  sortOrder: 1,
  isActive: true,
  icon: LayoutDashboard,
  ...overrides,
});

// MemoryRouter でラップしたレンダリングヘルパー
const renderWithRouter = (
  ui: React.ReactElement,
  { initialEntries = ["/"] } = {}
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  );
};

describe("SidebarNavItem", () => {
  it("ラベルを表示する", () => {
    const item = createNavItem({ label: "ダッシュボード" });
    renderWithRouter(<SidebarNavItem item={item} />);

    expect(screen.getByText("ダッシュボード")).toBeInTheDocument();
  });

  it("正しいパスへのリンクをレンダリングする", () => {
    const item = createNavItem({ path: "/dashboard" });
    renderWithRouter(<SidebarNavItem item={item} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("クリック時に onClick が呼ばれる", () => {
    const handleClick = vi.fn();
    const item = createNavItem();
    renderWithRouter(<SidebarNavItem item={item} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("link"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("onClick が指定されていない場合もエラーにならない", () => {
    const item = createNavItem();
    renderWithRouter(<SidebarNavItem item={item} />);

    // クリックしてもエラーにならないことを確認
    expect(() => {
      fireEvent.click(screen.getByRole("link"));
    }).not.toThrow();
  });

  it("アクティブなルートの場合にアクティブスタイルが適用される", () => {
    const item = createNavItem({ path: "/dashboard" });
    renderWithRouter(<SidebarNavItem item={item} />, {
      initialEntries: ["/dashboard"],
    });

    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-violet-100");
  });

  it("非アクティブなルートの場合にアクティブスタイルが適用されない", () => {
    const item = createNavItem({ path: "/dashboard" });
    renderWithRouter(<SidebarNavItem item={item} />, {
      initialEntries: ["/other"],
    });

    const link = screen.getByRole("link");
    expect(link.className).not.toContain("bg-violet-100");
  });

  it("ルートパス（/）の場合は end プロパティが true になる", () => {
    const item = createNavItem({ path: "/" });
    renderWithRouter(<SidebarNavItem item={item} />, {
      initialEntries: ["/"],
    });

    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-violet-100");
  });
});
