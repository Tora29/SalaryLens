import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormSection } from "../FormSection";

describe("FormSection", () => {
  it("タイトルが表示される", () => {
    render(
      <FormSection title="基本情報">
        <p>コンテンツ</p>
      </FormSection>
    );

    expect(
      screen.getByRole("heading", { name: "基本情報", level: 2 })
    ).toBeInTheDocument();
  });

  it("子要素がレンダリングされる", () => {
    render(
      <FormSection title="セクション">
        <input type="text" placeholder="名前を入力" />
        <button type="button">送信</button>
      </FormSection>
    );

    expect(screen.getByPlaceholderText("名前を入力")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  it("複数の子要素を含むことができる", () => {
    render(
      <FormSection title="フォーム">
        <div data-testid="child-1">子要素1</div>
        <div data-testid="child-2">子要素2</div>
        <div data-testid="child-3">子要素3</div>
      </FormSection>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });
});
