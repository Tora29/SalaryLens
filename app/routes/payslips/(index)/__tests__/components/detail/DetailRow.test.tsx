import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { DetailRow } from "../../../components/detail/DetailRow";

describe("DetailRow", () => {
  it("ラベルと値が表示される", () => {
    render(<DetailRow label="基本給" value="¥300,000" />);

    expect(screen.getByText("基本給")).toBeInTheDocument();
    expect(screen.getByText("¥300,000")).toBeInTheDocument();
  });

  it("highlight が false の場合、通常のスタイルで表示される", () => {
    render(<DetailRow label="残業手当" value="¥50,000" highlight={false} />);

    const label = screen.getByText("残業手当");
    const value = screen.getByText("¥50,000");

    // 通常スタイルの確認（text-gray-600 クラスを含む）
    expect(label).toHaveClass("text-gray-600");
    expect(value).not.toHaveClass("font-semibold");
  });

  it("highlight が true の場合、強調スタイルで表示される", () => {
    render(<DetailRow label="支給合計" value="¥400,000" highlight />);

    const label = screen.getByText("支給合計");
    const value = screen.getByText("¥400,000");

    // 強調スタイルの確認
    expect(label).toHaveClass("font-medium");
    expect(value).toHaveClass("font-semibold");
  });

  it("highlight プロパティのデフォルト値は false", () => {
    render(<DetailRow label="テスト項目" value="テスト値" />);

    const label = screen.getByText("テスト項目");
    // デフォルトでは強調なし
    expect(label).toHaveClass("text-gray-600");
  });

  it("空の値でも表示される", () => {
    render(<DetailRow label="特別手当" value="" />);

    expect(screen.getByText("特別手当")).toBeInTheDocument();
  });
});
