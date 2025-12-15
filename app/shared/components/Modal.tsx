import { X } from "lucide-react";

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** モーダルの最大幅（デフォルト: max-w-2xl） */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** フッターコンテンツ（ボタン等） */
  footer?: React.ReactNode;
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
} as const;

/**
 * M3 Dialog を使用した汎用モーダルコンポーネント
 * 背景クリックまたは閉じるボタンで閉じる
 */
export function Modal({
  title,
  onClose,
  children,
  maxWidth = "2xl",
  footer,
}: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-[28px] w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-12 min-h-12 flex items-center justify-center"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">{children}</div>

        {/* フッター（オプション） */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
