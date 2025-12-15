type Props = {
  label: string;
  value: string;
};

/**
 * 詳細表示用のカード型アイテム
 * 勤怠情報などのラベル+値ペアを表示
 */
export function DetailItem({ label, value }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}
