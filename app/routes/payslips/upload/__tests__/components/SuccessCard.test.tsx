import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { SuccessCard } from "../../components/SuccessCard";

// MemoryRouter でラップしたレンダリングヘルパー
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("SuccessCard", () => {
  it("正常系: メッセージを表示する", () => {
    renderWithRouter(<SuccessCard message="給与明細を保存しました" />);

    expect(screen.getByText("給与明細を保存しました")).toBeInTheDocument();
  });

  it("正常系: 保存完了タイトルを表示する", () => {
    renderWithRouter(<SuccessCard message="テストメッセージ" />);

    expect(screen.getByText("保存完了")).toBeInTheDocument();
  });

  it("正常系: 続けてアップロードリンクを表示する", () => {
    renderWithRouter(<SuccessCard message="テストメッセージ" />);

    const uploadLink = screen.getByRole("link", {
      name: "続けてアップロード",
    });
    expect(uploadLink).toBeInTheDocument();
    expect(uploadLink).toHaveAttribute("href", "/payslips/upload");
  });

  it("正常系: ダッシュボードへのリンクを表示する", () => {
    renderWithRouter(<SuccessCard message="テストメッセージ" />);

    const dashboardLink = screen.getByRole("link", {
      name: "ダッシュボードへ",
    });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/");
  });

  it("正常系: 成功アイコン（チェックマーク）を表示する", () => {
    const { container } = renderWithRouter(
      <SuccessCard message="テストメッセージ" />
    );

    // lucide-react の Check アイコンは SVG として描画される
    const svgIcon = container.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
  });
});
