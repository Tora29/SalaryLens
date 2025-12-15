// ライブラリ
import { Menu } from "lucide-react";

// 型定義
import type { MobileHeaderProps } from "../schema";

// ヘッダーコンポーネント（モバイル用）
export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30 lg:hidden">
      <div className="flex items-center h-full px-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="min-h-12 min-w-12 flex items-center justify-center rounded-full hover:bg-gray-900/8 dark:hover:bg-white/8 transition-colors"
          aria-label="メニューを開く"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
          SalaryLens
        </h1>
      </div>
    </header>
  );
}
