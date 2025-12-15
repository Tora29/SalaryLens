import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileX, Inbox, Search } from "lucide-react";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("メッセージが表示される", () => {
    render(<EmptyState icon={Inbox} message="データがありません" />);

    expect(screen.getByText("データがありません")).toBeInTheDocument();
  });

  it("アイコンがレンダリングされる", () => {
    const { container } = render(
      <EmptyState icon={FileX} message="ファイルが見つかりません" />
    );

    // Lucide アイコンは SVG としてレンダリングされる
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("異なるアイコンを使用できる", () => {
    const { container } = render(
      <EmptyState icon={Search} message="検索結果がありません" />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByText("検索結果がありません")).toBeInTheDocument();
  });

  it("長いメッセージも正しく表示される", () => {
    const longMessage =
      "現在表示できるデータがありません。新しいデータを追加するか、フィルター条件を変更してください。";
    render(<EmptyState icon={Inbox} message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
