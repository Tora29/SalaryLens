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
import type { MonthlySalary } from "../route";

type Props = {
  data: MonthlySalary[];
};

const MONTHS = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

// 分を時間に変換
function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10;
}

// Recharts用にデータを変換
function transformChartData(data: MonthlySalary[]) {
  return data.map((record, index) => ({
    month: MONTHS[index],
    // 手取り
    netSalary: record.netSalary,
    // 残業時間（分から時間に変換）
    extraOvertimeHours: minutesToHours(record.extraOvertimeMinutes),
    over60OvertimeHours: minutesToHours(record.over60OvertimeMinutes),
    nightOvertimeHours: minutesToHours(record.nightOvertimeMinutes),
  }));
}

// ツールチップのフォーマット
function formatTooltip(value: number, name: string) {
  if (name.includes("残業") || name.includes("h")) {
    return [`${value}h`, name];
  }
  return [`¥${value.toLocaleString()}`, name];
}

const SALARY_TICKS = [0, 200000, 400000, 600000, 800000, 1000000];
const HOURS_TICKS = [0, 20, 40, 60, 80, 100];

export function SalaryChart({ data }: Props) {
  const chartData = transformChartData(data);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        月別給与推移
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData}>
          {/* 横線（ReferenceLineで明示的に描画） */}
          {SALARY_TICKS.map((value) => (
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
            ticks={SALARY_TICKS}
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
            ticks={HOURS_TICKS}
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
            formatter={(value) => (
              <span className="text-sm text-gray-600">{value}</span>
            )}
          />
          {/* 給与バー */}
          <Bar
            yAxisId="salary"
            dataKey="netSalary"
            fill="#6366f1"
            name="手取り"
            radius={[4, 4, 0, 0]}
          />
          {/* 残業時間の折れ線（点線） */}
          <Line
            yAxisId="hours"
            type="linear"
            dataKey="extraOvertimeHours"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#f59e0b", r: 3 }}
            name="固定外残業"
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
          <Line
            yAxisId="hours"
            type="linear"
            dataKey="nightOvertimeHours"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#8b5cf6", r: 3 }}
            name="深夜残業"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
