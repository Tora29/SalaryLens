type Props = {
  label: string;
  value: string;
  /** 合計行などで強調表示するかどうか */
  highlight?: boolean;
};

/**
 * 詳細表示用の行コンポーネント
 * 支給・控除明細のラベル+金額を横並びで表示
 */
export function DetailRow({ label, value, highlight = false }: Props) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={`text-sm ${highlight ? "font-medium text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${highlight ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-900 dark:text-gray-100"}`}
      >
        {value}
      </span>
    </div>
  );
}
