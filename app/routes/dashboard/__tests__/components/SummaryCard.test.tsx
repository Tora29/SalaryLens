import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryCard } from "../../components/SummaryCard";
import { Wallet } from "lucide-react";

describe("SummaryCard", () => {
  it("正常系: タイトルと値を表示できる", () => {
    // Arrange & Act
    render(<SummaryCard title="合計収入" value="¥3,600,000" icon={Wallet} />);

    // Assert
    expect(screen.getByText("合計収入")).toBeInTheDocument();
    expect(screen.getByText("¥3,600,000")).toBeInTheDocument();
  });

  it("正常系: アイコンが表示される", () => {
    // Arrange & Act
    const { container } = render(
      <SummaryCard title="合計収入" value="¥3,600,000" icon={Wallet} />
    );

    // Assert: lucide-react のアイコンは SVG として描画される
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("正常系: trend='up' の場合、上昇トレンドが表示される", () => {
    // Arrange & Act
    render(
      <SummaryCard
        title="合計収入"
        value="¥3,600,000"
        icon={Wallet}
        trend="up"
        trendValue="+3.5%"
      />
    );

    // Assert
    expect(screen.getByText("+3.5%")).toBeInTheDocument();
    expect(screen.getByText("vs 前年")).toBeInTheDocument();
  });

  it("正常系: trend='down' の場合、下降トレンドが表示される", () => {
    // Arrange & Act
    render(
      <SummaryCard
        title="合計収入"
        value="¥3,600,000"
        icon={Wallet}
        trend="down"
        trendValue="-2.0%"
      />
    );

    // Assert
    expect(screen.getByText("-2.0%")).toBeInTheDocument();
    expect(screen.getByText("vs 前年")).toBeInTheDocument();
  });

  it("正常系: trend が指定されていない場合、トレンド表示がない", () => {
    // Arrange & Act
    render(<SummaryCard title="合計収入" value="¥3,600,000" icon={Wallet} />);

    // Assert
    expect(screen.queryByText("vs 前年")).not.toBeInTheDocument();
  });

  it("正常系: trend のみで trendValue がない場合、トレンド表示がない", () => {
    // Arrange & Act
    render(
      <SummaryCard
        title="合計収入"
        value="¥3,600,000"
        icon={Wallet}
        trend="up"
      />
    );

    // Assert
    expect(screen.queryByText("vs 前年")).not.toBeInTheDocument();
  });
});
