import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputField } from "../InputField";

describe("InputField", () => {
  it("ラベルと入力フィールドが表示される", () => {
    render(<InputField id="salary" label="基本給" defaultValue={300000} />);

    expect(screen.getByLabelText("基本給")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(300000);
  });

  it("文字列のデフォルト値が設定される", () => {
    render(
      <InputField id="name" label="名前" defaultValue="テスト" type="text" />
    );

    expect(screen.getByRole("textbox")).toHaveValue("テスト");
  });

  it("サフィックスが表示される", () => {
    render(
      <InputField
        id="salary"
        label="基本給"
        defaultValue={300000}
        suffix="円"
      />
    );

    expect(screen.getByText("円")).toBeInTheDocument();
  });

  it("サフィックスが指定されない場合は表示されない", () => {
    render(<InputField id="salary" label="基本給" defaultValue={300000} />);

    // 円が含まれていないことを確認
    expect(screen.queryByText("円")).not.toBeInTheDocument();
  });

  it("type が指定されると適用される", () => {
    render(
      <InputField
        id="email"
        label="メール"
        defaultValue="test@example.com"
        type="email"
      />
    );

    // type="email" の場合は textbox ロールになる
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("デフォルトで type=number が適用される", () => {
    render(<InputField id="amount" label="金額" defaultValue={100} />);

    expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
  });

  it("min と max が設定される", () => {
    render(
      <InputField
        id="hours"
        label="残業時間"
        defaultValue={20}
        min={0}
        max={100}
      />
    );

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });

  it("id が name 属性にも設定される", () => {
    render(<InputField id="test-field" label="テスト" defaultValue={0} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("id", "test-field");
    expect(input).toHaveAttribute("name", "test-field");
  });
});
