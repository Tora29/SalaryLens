import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../Modal";

describe("Modal", () => {
  const defaultProps = {
    title: "テストモーダル",
    onClose: vi.fn(),
    children: <p>モーダルコンテンツ</p>,
  };

  it("タイトルが表示される", () => {
    render(<Modal {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "テストモーダル", level: 2 })
    ).toBeInTheDocument();
  });

  it("子要素がレンダリングされる", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByText("モーダルコンテンツ")).toBeInTheDocument();
  });

  it("閉じるボタンをクリックすると onClose が呼ばれる", () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("背景をクリックすると onClose が呼ばれる", () => {
    const onClose = vi.fn();
    const { container } = render(<Modal {...defaultProps} onClose={onClose} />);

    // 背景オーバーレイをクリック
    const overlay = container.querySelector(".fixed.inset-0");
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay as Element);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("モーダルコンテンツをクリックしても onClose は呼ばれない", () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    // コンテンツ部分をクリック
    fireEvent.click(screen.getByText("モーダルコンテンツ"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("フッターが表示される", () => {
    render(
      <Modal {...defaultProps} footer={<button type="button">保存</button>} />
    );

    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("フッターが指定されない場合は表示されない", () => {
    const { container } = render(<Modal {...defaultProps} />);

    // フッター領域のボーダーを持つ要素が1つだけ（ヘッダー）であることを確認
    const borderedDivs = container.querySelectorAll(".border-t");
    expect(borderedDivs.length).toBe(0);
  });

  describe("maxWidth プロパティ", () => {
    it("デフォルトで max-w-2xl が適用される", () => {
      const { container } = render(<Modal {...defaultProps} />);

      expect(container.querySelector(".max-w-2xl")).toBeInTheDocument();
    });

    it("maxWidth=sm で max-w-sm が適用される", () => {
      const { container } = render(<Modal {...defaultProps} maxWidth="sm" />);

      expect(container.querySelector(".max-w-sm")).toBeInTheDocument();
    });

    it("maxWidth=lg で max-w-lg が適用される", () => {
      const { container } = render(<Modal {...defaultProps} maxWidth="lg" />);

      expect(container.querySelector(".max-w-lg")).toBeInTheDocument();
    });
  });
});
