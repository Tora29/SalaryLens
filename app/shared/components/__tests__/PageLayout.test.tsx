import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageLayout } from "../PageLayout";

describe("PageLayout", () => {
  it("子要素がレンダリングされる", () => {
    render(
      <PageLayout>
        <h1>ページタイトル</h1>
      </PageLayout>
    );

    expect(
      screen.getByRole("heading", { name: "ページタイトル" })
    ).toBeInTheDocument();
  });

  it("main 要素でラップされる", () => {
    render(
      <PageLayout>
        <div>コンテンツ</div>
      </PageLayout>
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("複数の子要素を含むことができる", () => {
    render(
      <PageLayout>
        <header>ヘッダー</header>
        <section>セクション</section>
        <footer>フッター</footer>
      </PageLayout>
    );

    expect(screen.getByText("ヘッダー")).toBeInTheDocument();
    expect(screen.getByText("セクション")).toBeInTheDocument();
    expect(screen.getByText("フッター")).toBeInTheDocument();
  });

  describe("maxWidth プロパティ", () => {
    it("デフォルトで max-w-7xl が適用される", () => {
      const { container } = render(
        <PageLayout>
          <div>コンテンツ</div>
        </PageLayout>
      );

      expect(container.querySelector(".max-w-7xl")).toBeInTheDocument();
    });

    it("maxWidth=2xl で max-w-2xl が適用される", () => {
      const { container } = render(
        <PageLayout maxWidth="2xl">
          <div>コンテンツ</div>
        </PageLayout>
      );

      expect(container.querySelector(".max-w-2xl")).toBeInTheDocument();
    });

    it("maxWidth=4xl で max-w-4xl が適用される", () => {
      const { container } = render(
        <PageLayout maxWidth="4xl">
          <div>コンテンツ</div>
        </PageLayout>
      );

      expect(container.querySelector(".max-w-4xl")).toBeInTheDocument();
    });
  });
});
