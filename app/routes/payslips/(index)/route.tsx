// React・ライブラリ
import { useSearchParams } from "react-router";
import { FileText } from "lucide-react";

// 型定義
import type { Route } from "./+types/route";
import type { SalaryRecord } from "./schema";

// サーバー・ロジック
import { MESSAGES } from "./schema";
import { getLoaderData } from "./server";

// 共有コンポーネント
import { EmptyState } from "~/shared/components/EmptyState";
import { PageLayout } from "~/shared/components/PageLayout";
import { RouteErrorBoundary } from "~/shared/components/RouteErrorBoundary";

// ローカルコンポーネント
import { ExportModal } from "./components/ExportModal";
import { PageHeader } from "./components/PageHeader";
import { PayslipDetailModal } from "./components/PayslipDetailModal";
import { PayslipsTable } from "./components/PayslipsTable";

// ========== Loader ==========

export async function loader({ request }: Route.LoaderArgs) {
  return getLoaderData(request);
}

// ========== コンポーネント ==========

export default function PayslipsList({ loaderData }: Route.ComponentProps) {
  const { records, selectedYear, availableYears } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  // 全件表示かどうか
  const isAllYears = selectedYear === "all";

  // URLパラメータから詳細モーダルの状態を取得
  const detailRecordId = searchParams.get("detail");
  const selectedRecord = detailRecordId
    ? (records.find((r) => r.id === detailRecordId) ?? null)
    : null;

  // URLパラメータからCSV出力モーダルの状態を取得
  const showExportModal = searchParams.get("modal") === "export";

  // 年変更ハンドラ
  const handleYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("year", value);
    setSearchParams(params);
  };

  // 詳細モーダルを開く
  const openDetailModal = (record: SalaryRecord) => {
    const params = new URLSearchParams(searchParams);
    params.set("detail", record.id);
    setSearchParams(params);
  };

  // CSV出力モーダルを開く
  const openExportModal = () => {
    const params = new URLSearchParams(searchParams);
    params.set("modal", "export");
    setSearchParams(params);
  };

  // モーダルを閉じる
  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("detail");
    params.delete("modal");
    setSearchParams(params);
  };

  return (
    <PageLayout>
      <PageHeader
        recordsCount={records.length}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onYearChange={handleYearChange}
        onExportClick={openExportModal}
      />

      {records.length > 0 ? (
        <PayslipsTable
          records={records}
          isAllYears={isAllYears}
          onRecordClick={openDetailModal}
        />
      ) : (
        <EmptyState
          icon={FileText}
          message={
            isAllYears
              ? MESSAGES.empty.noRecords
              : MESSAGES.empty.noRecordsForYear(selectedYear)
          }
        />
      )}

      {/* 詳細モーダル */}
      {selectedRecord && (
        <PayslipDetailModal record={selectedRecord} onClose={closeModal} />
      )}

      {/* CSV出力モーダル */}
      {showExportModal && (
        <ExportModal
          isAllYears={isAllYears}
          selectedYear={selectedYear}
          records={records}
          onClose={closeModal}
        />
      )}
    </PageLayout>
  );
}

// ========== ErrorBoundary ==========

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorBoundary error={error} />;
}
