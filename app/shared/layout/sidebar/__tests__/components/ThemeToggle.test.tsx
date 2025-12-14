import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../../components/ThemeToggle";

describe("ThemeToggle", () => {
  let originalCookie: string;
  let mockAdd: ReturnType<typeof vi.fn<(...args: string[]) => void>>;
  let mockRemove: ReturnType<typeof vi.fn<(...args: string[]) => void>>;

  beforeEach(() => {
    // Cookie をモック
    originalCookie = document.cookie;
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });

    // classList をモック
    mockAdd = vi.fn<(...args: string[]) => void>();
    mockRemove = vi.fn<(...args: string[]) => void>();
    vi.spyOn(document.documentElement.classList, "add").mockImplementation(
      mockAdd
    );
    vi.spyOn(document.documentElement.classList, "remove").mockImplementation(
      mockRemove
    );
  });

  afterEach(() => {
    // Cookie を復元
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: originalCookie,
    });

    vi.restoreAllMocks();
  });

  it("light テーマで初期化すると Moon アイコンが表示される", () => {
    render(<ThemeToggle initialTheme="light" />);

    // light テーマでは dark モードへの切り替えを案内
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  it("dark テーマで初期化すると Sun アイコンが表示される", () => {
    render(<ThemeToggle initialTheme="dark" />);

    // dark テーマでは light モードへの切り替えを案内
    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });

  it("light から dark へ切り替えるとき Cookie を設定し classList に dark を追加する", () => {
    render(<ThemeToggle initialTheme="light" />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(document.cookie).toContain("theme=dark");
    expect(mockAdd).toHaveBeenCalledWith("dark");
  });

  it("dark から light へ切り替えるとき Cookie を設定し classList から dark を削除する", () => {
    render(<ThemeToggle initialTheme="dark" />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(document.cookie).toContain("theme=light");
    expect(mockRemove).toHaveBeenCalledWith("dark");
  });

  it("テーマを2回切り替えると元に戻る", () => {
    render(<ThemeToggle initialTheme="light" />);

    const button = screen.getByRole("button");

    // 1回目: light → dark
    fireEvent.click(button);
    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();

    // 2回目: dark → light
    fireEvent.click(button);
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });
});
