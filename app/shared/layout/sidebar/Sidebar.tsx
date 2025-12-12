import { useEffect } from "react";

import { X } from "lucide-react";

import { SidebarNavItem } from "./components/SidebarNavItem";
import { ThemeToggle } from "./components/ThemeToggle";
import type { SidebarProps } from "./schema";

// サイドバーコンポーネント
export function Sidebar({
  isOpen,
  onClose,
  initialTheme,
  navigationItems,
}: SidebarProps) {
  // ESCキーでサイドバーを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // モバイルでサイドバーが開いているときはスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* モバイル用オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* サイドバー本体 */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-50 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 ease-out lg:translate-x-0 rounded-r-2xl lg:rounded-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="メインナビゲーション"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            SalaryLens
          </h1>
          {/* モバイル用閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden min-h-12 min-w-12 flex items-center justify-center rounded-full hover:bg-gray-900/8 dark:hover:bg-white/8 transition-colors"
            aria-label="サイドバーを閉じる"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              onClick={() => {
                // モバイルでは遷移時にサイドバーを閉じる
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
            />
          ))}
        </nav>

        {/* フッター（テーマ切り替え） */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              テーマ
            </span>
            <ThemeToggle initialTheme={initialTheme} />
          </div>
        </div>
      </aside>
    </>
  );
}
