import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as reactRouter from "react-router";
import { RouteErrorBoundary } from "../RouteErrorBoundary";

// react-router の isRouteErrorResponse をモック
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    isRouteErrorResponse: vi.fn(),
  };
});

describe("RouteErrorBoundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("ルートエラーレスポンスの場合", () => {
    beforeEach(() => {
      vi.mocked(reactRouter.isRouteErrorResponse).mockReturnValue(true);
    });

    it("ステータスコードが表示される", () => {
      const error = { status: 404, data: "ページが見つかりません" };
      render(<RouteErrorBoundary error={error} />);

      expect(
        screen.getByRole("heading", { name: "404", level: 1 })
      ).toBeInTheDocument();
    });

    it("エラーメッセージが表示される", () => {
      const error = { status: 404, data: "ページが見つかりません" };
      render(<RouteErrorBoundary error={error} />);

      expect(screen.getByText("ページが見つかりません")).toBeInTheDocument();
    });

    it("500 エラーが正しく表示される", () => {
      const error = { status: 500, data: "サーバーエラーが発生しました" };
      render(<RouteErrorBoundary error={error} />);

      expect(
        screen.getByRole("heading", { name: "500", level: 1 })
      ).toBeInTheDocument();
      expect(
        screen.getByText("サーバーエラーが発生しました")
      ).toBeInTheDocument();
    });
  });

  describe("一般的なエラーの場合", () => {
    beforeEach(() => {
      vi.mocked(reactRouter.isRouteErrorResponse).mockReturnValue(false);
    });

    it("汎用エラータイトルが表示される", () => {
      const error = new Error("Something went wrong");
      render(<RouteErrorBoundary error={error} />);

      expect(
        screen.getByRole("heading", { name: "エラー", level: 1 })
      ).toBeInTheDocument();
    });

    it("汎用エラーメッセージが表示される", () => {
      const error = new Error("Something went wrong");
      render(<RouteErrorBoundary error={error} />);

      expect(
        screen.getByText("予期しないエラーが発生しました")
      ).toBeInTheDocument();
    });

    it("null エラーでも正しく表示される", () => {
      render(<RouteErrorBoundary error={null} />);

      expect(
        screen.getByRole("heading", { name: "エラー", level: 1 })
      ).toBeInTheDocument();
    });

    it("undefined エラーでも正しく表示される", () => {
      render(<RouteErrorBoundary error={undefined} />);

      expect(
        screen.getByRole("heading", { name: "エラー", level: 1 })
      ).toBeInTheDocument();
    });
  });

  it("PageLayout でラップされる", () => {
    vi.mocked(reactRouter.isRouteErrorResponse).mockReturnValue(false);
    render(<RouteErrorBoundary error={new Error("test")} />);

    // PageLayout は main 要素を使用
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
