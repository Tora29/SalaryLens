import { Calendar, ArrowUpRight } from "lucide-react";
import type { SalaryRecord } from "../schema";
import { formatCurrency } from "../utils";

type Props = {
  records: SalaryRecord[];
};

const MONTHS = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export function RecentHistory({ records }: Props) {
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
                      {record.year}年 {MONTHS[record.month]}
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
