type Props = {
  message: string;
};

/**
 * M3 Error Container を使用したエラーメッセージ表示
 */
export function ErrorMessage({ message }: Props) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}
