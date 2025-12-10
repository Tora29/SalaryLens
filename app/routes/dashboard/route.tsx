import type { Route } from "./+types/route";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Banknote,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { SalaryRecord } from "./schema";
import { getDashboardData } from "./server";

export async function loader(_args: Route.LoaderArgs) {
  return getDashboardData();
}

// 金額フォーマット
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

// サマリーカードコンポーネント
function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {trendValue}
              </span>
              <span className="text-sm text-gray-400">vs 前年</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
          <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    </div>
  );
}

// バーチャートコンポーネント（Recharts）
function SalaryChart({ data }: { data: SalaryRecord[] }) {
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  // Recharts 用にデータを変換
  const chartData = data.map((record, index) => ({
    month: months[index],
    // 賞与なしの手取り相当
    baseNet: Math.round(record.netSalary - record.bonus * 0.8),
    // 賞与の手取り相当（控除後）
    bonusNet: Math.round(record.bonus * 0.8),
    // 残業時間
    fixedOvertimeHours: record.fixedOvertimeHours,
    extraOvertimeHours: record.extraOvertimeHours,
    over60OvertimeHours: record.over60OvertimeHours,
  }));

  // ツールチップのフォーマット
  const formatTooltip = (value: number, name: string) => {
    if (name.includes("残業") || name.includes("h")) {
      return [`${value}h`, name];
    }
    return [`¥${value.toLocaleString()}`, name];
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">月別給与推移</h2>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData}>
          {/* 横線（ReferenceLine で明示的に描画） */}
          {[0, 200000, 400000, 600000, 800000, 1000000].map((value) => (
            <ReferenceLine
              key={value}
              y={value}
              yAxisId="salary"
              stroke="#9ca3af"
              strokeDasharray="3 3"
            />
          ))}
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          {/* 左Y軸: 給与 */}
          <YAxis
            yAxisId="salary"
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 1000000]}
            ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
          />
          {/* 右Y軸: 残業時間 */}
          <YAxis
            yAxisId="hours"
            orientation="right"
            tickFormatter={(value) => `${value}h`}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
          />
          <Tooltip
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          <Legend
            formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
          />
          {/* 給与バー */}
          <Bar yAxisId="salary" dataKey="baseNet" stackId="salary" fill="#6366f1" name="手取り" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="salary" dataKey="bonusNet" stackId="salary" fill="#c7d2fe" name="賞与" radius={[4, 4, 0, 0]} />
          {/* 残業時間の折れ線（点線） */}
          <Line
            yAxisId="hours"
            type="linear"
            dataKey="fixedOvertimeHours"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#10b981", r: 3 }}
            name="固定残業(~45h)"
          />
          <Line
            yAxisId="hours"
            type="linear"
            dataKey="extraOvertimeHours"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#f59e0b", r: 3 }}
            name="固定外残業(45-60h)"
          />
          <Line
            yAxisId="hours"
            type="linear"
            dataKey="over60OvertimeHours"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#ef4444", r: 3 }}
            name="60h超残業"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// 履歴テーブルコンポーネント
function RecentHistory({ records }: { records: SalaryRecord[] }) {
  const months = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">最近の給与明細</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          すべて表示
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">期間</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">基本給</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">残業代</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">賞与</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">控除</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">手取り</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {record.year}年 {months[record.month]}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-700 dark:text-gray-300">
                  {formatCurrency(record.baseSalary)}
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-700 dark:text-gray-300">
                  {formatCurrency(record.overtime)}
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-700 dark:text-gray-300">
                  {record.bonus > 0 ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {formatCurrency(record.bonus)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-4 px-4 text-right text-sm text-red-500">
                  -{formatCurrency(record.deductions)}
                </td>
                <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(record.netSalary)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { summary, monthlySalaries, recentRecords } = loaderData;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">ダッシュボード</h1>
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
            title="年間賞与合計"
            value={formatCurrency(summary.totalBonus)}
            icon={TrendingUp}
          />
          <SummaryCard
            title="今月の手取り"
            value={formatCurrency(monthlySalaries[monthlySalaries.length - 1]?.netSalary ?? 0)}
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
