// React・ライブラリ
import { Link } from "react-router";
import { Check } from "lucide-react";

// 型定義
import type { SuccessCardProps } from "./types";

/**
 * 保存成功時のカード表示
 * M3 Elevated Card と Primary Container を使用
 */
export function SuccessCard({ message }: SuccessCardProps) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* M3 Elevated Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 text-center">
          {/* 成功アイコン - M3 Primary Container */}
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            保存完了
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-center">
            {/* M3 Filled Button */}
            <Link
              to="/payslips/upload"
              className="min-h-12 px-6 py-2.5 bg-indigo-600 hover:shadow-md active:shadow-none text-white rounded-full text-sm font-medium tracking-wide transition-shadow flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              続けてアップロード
            </Link>
            {/* M3 Outlined Button */}
            <Link
              to="/"
              className="min-h-12 px-6 py-2.5 border border-gray-400 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium tracking-wide hover:bg-indigo-600/8 active:bg-indigo-600/12 transition-colors flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              ダッシュボードへ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
