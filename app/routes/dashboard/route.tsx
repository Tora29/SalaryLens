// ライブラリ
import { Banknote, Calendar, TrendingUp, Wallet } from "lucide-react";

// 型定義
import type { Route } from "./+types/route";

// サーバー・ロジック
import { getDashboardData } from "./server";

// 共有コンポーネント・ユーティリティ
import { RouteErrorBoundary } from "~/shared/components/RouteErrorBoundary";
import { formatCurrency } from "~/shared/utils/format";

// ローカルコンポーネント
import { RecentHistory } from "./components/RecentHistory";
import { SalaryChart } from "./components/SalaryChart";
import { SummaryCard } from "./components/SummaryCard";

export async function loader(_args: Route.LoaderArgs) {
  return getDashboardData();
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { summary, monthlySalaries, recentRecords } = loaderData;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            ダッシュボード
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            あなたの給与データの概要
          </p>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="年間手取り合計"
            value={formatCurrency(summary.totalNetSalary)}
            icon={Wallet}
            trend={summary.yearOverYearChange >= 0 ? "up" : "down"}
            trendValue={`${Math.abs(summary.yearOverYearChange)}%`}
          />
          <SummaryCard
            title="平均月収"
            value={formatCurrency(summary.averageNetSalary)}
            icon={Banknote}
          />
          <SummaryCard
            title="年間控除合計"
            value={formatCurrency(summary.totalDeductions)}
            icon={TrendingUp}
          />
          <SummaryCard
            title="今月の手取り"
            value={formatCurrency(
              monthlySalaries[monthlySalaries.length - 1]?.netSalary ?? 0
            )}
            icon={Calendar}
          />
        </div>

        {/* チャート */}
        <div className="mb-8">
          <SalaryChart data={monthlySalaries} />
        </div>

        {/* 履歴テーブル */}
        <RecentHistory records={recentRecords} />
      </div>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorBoundary error={error} />;
}
