import { isRouteErrorResponse } from "react-router";
import { PageLayout } from "./PageLayout";

type Props = {
  error: unknown;
};

/**
 * 共通のエラーバウンダリコンポーネント
 * ルートで発生したエラーを表示する
 */
export function RouteErrorBoundary({ error }: Props) {
  if (isRouteErrorResponse(error)) {
    return (
      <PageLayout>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {error.status}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{error.data}</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        エラー
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        予期しないエラーが発生しました
      </p>
    </PageLayout>
  );
}
