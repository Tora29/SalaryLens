import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { LayoutDashboard, Upload } from "lucide-react";
import { Sidebar } from "../Sidebar";
import type { NavigationItemWithIcon } from "../schema";

// テスト用のナビゲーション項目
const mockNavigationItems: NavigationItemWithIcon[] = [
  {
    id: "1",
    path: "/dashboard",
    label: "ダッシュボード",
    iconName: "LayoutDashboard",
    sortOrder: 1,
    isActive: true,
    icon: LayoutDashboard,
  },
  {
    id: "2",
    path: "/upload",
    label: "アップロード",
    iconName: "Upload",
    sortOrder: 2,
    isActive: true,
    icon: Upload,
  },
];

// MemoryRouter でラップしたレンダリングヘルパー
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("Sidebar", () => {
  let originalOverflow: string;
  let mockClassList: {
    add: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // body.style.overflow を保存
    originalOverflow = document.body.style.overflow;

    // classList をモック（ThemeToggle 用）
    mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
    };
    vi.spyOn(document.documentElement.classList, "add").mockImplementation(
      mockClassList.add
    );
    vi.spyOn(document.documentElement.classList, "remove").mockImplementation(
      mockClassList.remove
    );
  });

  afterEach(() => {
    // body.style.overflow を復元
    document.body.style.overflow = originalOverflow;
    vi.restoreAllMocks();
  });

  it("タイトル「SalaryLens」を表示する", () => {
    renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={vi.fn()}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    expect(screen.getByText("SalaryLens")).toBeInTheDocument();
  });

  it("ナビゲーション項目を表示する", () => {
    renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={vi.fn()}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    expect(screen.getByText("ダッシュボード")).toBeInTheDocument();
    expect(screen.getByText("アップロード")).toBeInTheDocument();
  });

  it("テーマ切り替えボタンを表示する", () => {
    renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={vi.fn()}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    expect(screen.getByText("テーマ")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  it("閉じるボタンをクリックすると onClose が呼ばれる", () => {
    const handleClose = vi.fn();
    renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={handleClose}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    const closeButton = screen.getByRole("button", {
      name: /サイドバーを閉じる/i,
    });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("オーバーレイをクリックすると onClose が呼ばれる", () => {
    const handleClose = vi.fn();
    renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={handleClose}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    // aria-hidden="true" のオーバーレイを取得
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("isOpen が true の場合、ESC キーで onClose が呼ばれる", () => {
    const handleClose = vi.fn();
    renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={handleClose}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("isOpen が false の場合、ESC キーで onClose が呼ばれない", () => {
    const handleClose = vi.fn();
    renderWithRouter(
      <Sidebar
        isOpen={false}
        onClose={handleClose}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("isOpen が true の場合、body のスクロールが無効化される", () => {
    renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={vi.fn()}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("isOpen が false の場合、body のスクロールが有効化される", () => {
    const { rerender } = renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={vi.fn()}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    // isOpen を false に変更
    rerender(
      <MemoryRouter>
        <Sidebar
          isOpen={false}
          onClose={vi.fn()}
          initialTheme="light"
          navigationItems={mockNavigationItems}
        />
      </MemoryRouter>
    );

    expect(document.body.style.overflow).toBe("");
  });

  it("メインナビゲーションとしての aria-label が設定されている", () => {
    renderWithRouter(
      <Sidebar
        isOpen={true}
        onClose={vi.fn()}
        initialTheme="light"
        navigationItems={mockNavigationItems}
      />
    );

    expect(
      screen.getByRole("complementary", { name: /メインナビゲーション/i })
    ).toBeInTheDocument();
  });

  it("空のナビゲーション項目でもエラーにならない", () => {
    expect(() => {
      renderWithRouter(
        <Sidebar
          isOpen={true}
          onClose={vi.fn()}
          initialTheme="light"
          navigationItems={[]}
        />
      );
    }).not.toThrow();
  });
});
