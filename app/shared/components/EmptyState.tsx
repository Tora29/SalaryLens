import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  message: string;
};

/**
 * データがない場合の空状態表示コンポーネント
 * アイコンとメッセージを中央に表示
 */
export function EmptyState({ icon: Icon, message }: Props) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
