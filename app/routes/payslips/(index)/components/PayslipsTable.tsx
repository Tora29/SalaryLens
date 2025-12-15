// 型定義
import type { PayslipsTableProps } from "./types";

// 共有コンポーネント
import { formatCurrency } from "~/shared/utils/format";

/**
 * 給与明細一覧テーブル
 * 各行クリックで詳細モーダルを開く
 */
export function PayslipsTable({
  records,
  isAllYears,
  onRecordClick,
}: PayslipsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                {isAllYears ? "年月" : "月"}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                支給合計
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                控除合計
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                差引支給額
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {records.map((record) => (
              <tr
                key={record.id}
                onClick={() => onRecordClick(record)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {isAllYears
                    ? `${record.year}年${record.month}月`
                    : `${record.month}月`}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">
                  {formatCurrency(record.totalEarnings)}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-500 dark:text-gray-400">
                  {formatCurrency(record.totalDeductions)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
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
