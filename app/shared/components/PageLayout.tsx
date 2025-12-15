type Props = {
  children: React.ReactNode;
  /** コンテンツの最大幅（デフォルト: 7xl） */
  maxWidth?: "2xl" | "4xl" | "7xl";
};

const maxWidthClasses = {
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "7xl": "max-w-7xl",
} as const;

/**
 * 共通のページレイアウトコンポーネント
 * 一貫した背景色、パディング、最大幅を提供
 */
export function PageLayout({ children, maxWidth = "7xl" }: Props) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>{children}</div>
    </main>
  );
}
