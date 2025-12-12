type Props = {
  title: string;
  children: React.ReactNode;
};

/**
 * M3 Elevated Card を使用したフォームセクション
 * タイトル付きのカードラッパー
 */
export function FormSection({ title, children }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}
