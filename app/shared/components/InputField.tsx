type Props = {
  id: string;
  label: string;
  defaultValue: number | string;
  suffix?: string;
  type?: string;
  min?: number;
  max?: number;
};

/**
 * M3 Outlined Text Field コンポーネント
 * Material Design 3 のガイドラインに準拠した入力フィールド
 */
export function InputField({
  id,
  label,
  defaultValue,
  suffix,
  type = "number",
  min,
  max,
}: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 tracking-wide"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={id}
          min={min}
          max={max}
          defaultValue={defaultValue}
          className="w-full min-h-12 px-4 py-3 border border-gray-400 dark:border-gray-600 rounded-lg bg-transparent text-base text-gray-900 dark:text-gray-100 focus:border-indigo-600 focus:border-2 focus:outline-none transition-colors"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
