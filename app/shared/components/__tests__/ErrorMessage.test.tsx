import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("エラーメッセージが表示される", () => {
    render(<ErrorMessage message="入力内容に誤りがあります" />);

    expect(screen.getByText("入力内容に誤りがあります")).toBeInTheDocument();
  });

  it("空のメッセージでもレンダリングされる", () => {
    const { container } = render(<ErrorMessage message="" />);

    // コンテナ要素は存在する
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("長いメッセージも表示される", () => {
    const longMessage =
      "このフィールドは必須です。有効な値を入力してください。入力値は1以上100以下の整数である必要があります。";
    render(<ErrorMessage message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
