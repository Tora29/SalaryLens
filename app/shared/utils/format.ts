/**
 * 金額を通貨形式でフォーマットする（例: ¥326,767）
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * 数値をカンマ区切りの文字列に変換する（例: 326,767）
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString("ja-JP");
}

/**
 * 分を「X時間Y分」形式にフォーマットする
 */
export function formatMinutesToHoursAndMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}時間${minutes}分`;
}
