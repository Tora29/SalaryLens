// React・ライブラリ
import { ChevronDown, FileSpreadsheet } from "lucide-react";

// 型定義
import type { PageHeaderProps } from "../types";

/**
 * ページヘッダーコンポーネント
 * タイトル、CSV出力ボタン、年選択セレクトを含む
 */
export function PageHeader({
  recordsCount,
  selectedYear,
  availableYears,
  onYearChange,
  onExportClick,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          給与明細一覧
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          過去の給与明細を確認できます
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* CSV出力ボタン */}
        {recordsCount > 0 && (
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-12"
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            CSV出力
          </button>
        )}

        {/* 年選択セレクトボックス */}
        {availableYears.length > 0 && (
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer min-h-12"
              aria-label="表示年を選択"
            >
              <option value="all">すべての年</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}年
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  );
}
