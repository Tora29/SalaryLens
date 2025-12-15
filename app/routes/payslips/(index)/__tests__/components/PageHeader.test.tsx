import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { PageHeader } from "../../components/PageHeader";

describe("PageHeader", () => {
  const defaultProps = {
    recordsCount: 5,
    selectedYear: 2024 as number | "all",
    availableYears: [2024, 2023, 2022],
    onYearChange: vi.fn(),
    onExportClick: vi.fn(),
  };

  it("タイトルと説明文が表示される", () => {
    render(<PageHeader {...defaultProps} />);

    expect(screen.getByText("給与明細一覧")).toBeInTheDocument();
    expect(
      screen.getByText("過去の給与明細を確認できます")
    ).toBeInTheDocument();
  });

  it("CSV出力ボタンがレコードがある場合に表示される", () => {
    render(<PageHeader {...defaultProps} recordsCount={5} />);

    expect(screen.getByText("CSV出力")).toBeInTheDocument();
  });

  it("CSV出力ボタンがレコードがない場合に非表示になる", () => {
    render(<PageHeader {...defaultProps} recordsCount={0} />);

    expect(screen.queryByText("CSV出力")).not.toBeInTheDocument();
  });

  it("CSV出力ボタンをクリックすると onExportClick が呼ばれる", () => {
    const onExportClick = vi.fn();
    render(<PageHeader {...defaultProps} onExportClick={onExportClick} />);

    fireEvent.click(screen.getByText("CSV出力"));

    expect(onExportClick).toHaveBeenCalledTimes(1);
  });

  it("年選択セレクトボックスが表示される", () => {
    render(<PageHeader {...defaultProps} />);

    expect(
      screen.getByRole("combobox", { name: "表示年を選択" })
    ).toBeInTheDocument();
  });

  it("年選択セレクトボックスに「すべての年」オプションがある", () => {
    render(<PageHeader {...defaultProps} />);

    expect(
      screen.getByRole("option", { name: "すべての年" })
    ).toBeInTheDocument();
  });

  it("利用可能な年がオプションとして表示される", () => {
    render(<PageHeader {...defaultProps} />);

    expect(screen.getByRole("option", { name: "2024年" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2023年" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2022年" })).toBeInTheDocument();
  });

  it("年を変更すると onYearChange が呼ばれる", () => {
    const onYearChange = vi.fn();
    render(<PageHeader {...defaultProps} onYearChange={onYearChange} />);

    fireEvent.change(screen.getByRole("combobox", { name: "表示年を選択" }), {
      target: { value: "2023" },
    });

    expect(onYearChange).toHaveBeenCalledWith("2023");
  });

  it("selectedYear が 'all' の場合、「すべての年」が選択されている", () => {
    render(<PageHeader {...defaultProps} selectedYear="all" />);

    const select = screen.getByRole("combobox", { name: "表示年を選択" });
    expect(select).toHaveValue("all");
  });

  it("availableYears が空の場合、セレクトボックスが非表示になる", () => {
    render(<PageHeader {...defaultProps} availableYears={[]} />);

    expect(
      screen.queryByRole("combobox", { name: "表示年を選択" })
    ).not.toBeInTheDocument();
  });
});
