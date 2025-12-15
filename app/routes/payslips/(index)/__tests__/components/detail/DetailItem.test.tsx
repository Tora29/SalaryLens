import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { DetailItem } from "../../../components/detail/DetailItem";

describe("DetailItem", () => {
  it("ラベルと値が表示される", () => {
    render(<DetailItem label="固定外残業時間" value="2時間30分" />);

    expect(screen.getByText("固定外残業時間")).toBeInTheDocument();
    expect(screen.getByText("2時間30分")).toBeInTheDocument();
  });

  it("空の値でも表示される", () => {
    render(<DetailItem label="有休" value="" />);

    expect(screen.getByText("有休")).toBeInTheDocument();
  });

  it("複数のDetailItemが独立して表示される", () => {
    render(
      <>
        <DetailItem label="項目A" value="値A" />
        <DetailItem label="項目B" value="値B" />
      </>
    );

    expect(screen.getByText("項目A")).toBeInTheDocument();
    expect(screen.getByText("値A")).toBeInTheDocument();
    expect(screen.getByText("項目B")).toBeInTheDocument();
    expect(screen.getByText("値B")).toBeInTheDocument();
  });
});
