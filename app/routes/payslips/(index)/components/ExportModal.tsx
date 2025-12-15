// React・ライブラリ
import { useState, useMemo } from "react";
import { ChevronDown, FileSpreadsheet } from "lucide-react";

// 型定義
import type { ExportRangeType } from "../schema";
import type { ExportModalProps } from "../types";

// サーバー・ロジック
import {
  generateCsvContent,
  generateCsvFilename,
  filterRecordsForExport,
} from "../service";

// 共有コンポーネント
import { Modal } from "~/shared/components/Modal";

/**
 * CSV出力モーダル
 * 出力範囲（全件/年/月）を選択してCSVダウンロード
 */
export function ExportModal({
  isAllYears,
  selectedYear,
  records,
  onClose,
}: ExportModalProps) {
  const [rangeType, setRangeType] = useState<ExportRangeType>("all");
  const [exportYear, setExportYear] = useState<number | undefined>(undefined);
  const [exportMonth, setExportMonth] = useState<number | undefined>(undefined);

  // レコードから利用可能な年と月を取得
  const availableYears = useMemo(() => {
    const years = [...new Set(records.map((r) => r.year))];
    return years.sort((a, b) => b - a);
  }, [records]);

  const availableMonthsForYear = useMemo(() => {
    if (!exportYear) return [];
    const months = records
      .filter((r) => r.year === exportYear)
      .map((r) => r.month);
    return [...new Set(months)].sort((a, b) => a - b);
  }, [records, exportYear]);

  // 範囲タイプ変更時に年・月をリセット
  const handleRangeTypeChange = (type: ExportRangeType) => {
    setRangeType(type);
    if (type === "all") {
      setExportYear(undefined);
      setExportMonth(undefined);
    } else if (type === "year") {
      setExportYear(availableYears[0]);
      setExportMonth(undefined);
    } else if (type === "month") {
      setExportYear(availableYears[0]);
      const firstYearMonths = records
        .filter((r) => r.year === availableYears[0])
        .map((r) => r.month);
      setExportMonth(Math.min(...firstYearMonths));
    }
  };

  // 年変更時に月をリセット
  const handleExportYearChange = (year: number) => {
    setExportYear(year);
    if (rangeType === "month") {
      const monthsForYear = records
        .filter((r) => r.year === year)
        .map((r) => r.month);
      setExportMonth(Math.min(...monthsForYear));
    }
  };

  // CSVエクスポート実行
  const handleExport = () => {
    const targetRecords = filterRecordsForExport(
      records,
      rangeType,
      exportYear,
      exportMonth
    );

    if (targetRecords.length === 0) {
      return;
    }

    const csvContent = generateCsvContent(targetRecords);
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = generateCsvFilename(rangeType, exportYear, exportMonth);
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-12"
      >
        キャンセル
      </button>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors min-h-12"
      >
        <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
        出力
      </button>
    </>
  );

  return (
    <Modal title="CSV出力" onClose={onClose} maxWidth="md" footer={footer}>
      <div className="space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          出力範囲を選択してください
        </p>

        {/* 範囲選択ラジオボタン */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="exportRange"
              value="all"
              checked={rangeType === "all"}
              onChange={() => handleRangeTypeChange("all")}
              className="w-5 h-5 text-primary"
            />
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {isAllYears ? "全件" : `${selectedYear}年の全件`}
            </span>
          </label>

          {isAllYears && availableYears.length > 0 && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="exportRange"
                value="year"
                checked={rangeType === "year"}
                onChange={() => handleRangeTypeChange("year")}
                className="w-5 h-5 text-primary"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">
                年を指定
              </span>
            </label>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="exportRange"
              value="month"
              checked={rangeType === "month"}
              onChange={() => handleRangeTypeChange("month")}
              className="w-5 h-5 text-primary"
            />
            <span className="text-sm text-gray-900 dark:text-gray-100">
              月を指定
            </span>
          </label>
        </div>

        {/* 年選択（年指定または月指定の場合） */}
        {(rangeType === "year" || rangeType === "month") && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              年
            </label>
            <div className="relative">
              <select
                value={exportYear}
                onChange={(e) => handleExportYearChange(Number(e.target.value))}
                className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-12"
              >
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
          </div>
        )}

        {/* 月選択（月指定の場合） */}
        {rangeType === "month" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              月
            </label>
            <div className="relative">
              <select
                value={exportMonth}
                onChange={(e) => setExportMonth(Number(e.target.value))}
                className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-12"
              >
                {availableMonthsForYear.map((month) => (
                  <option key={month} value={month}>
                    {month}月
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
