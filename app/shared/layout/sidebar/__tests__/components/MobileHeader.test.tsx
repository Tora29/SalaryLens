import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileHeader } from "../../components/MobileHeader";

describe("MobileHeader", () => {
  it("タイトルを表示する", () => {
    render(<MobileHeader onMenuClick={vi.fn()} />);

    expect(screen.getByText("SalaryLens")).toBeInTheDocument();
  });

  it("メニューボタンをクリックすると onMenuClick が呼ばれる", () => {
    const handleMenuClick = vi.fn();
    render(<MobileHeader onMenuClick={handleMenuClick} />);

    const menuButton = screen.getByRole("button", { name: /メニューを開く/i });
    fireEvent.click(menuButton);

    expect(handleMenuClick).toHaveBeenCalledTimes(1);
  });

  it("メニューボタンに適切な aria-label が設定されている", () => {
    render(<MobileHeader onMenuClick={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /メニューを開く/i })
    ).toBeInTheDocument();
  });

  it("header 要素としてレンダリングされる", () => {
    render(<MobileHeader onMenuClick={vi.fn()} />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
