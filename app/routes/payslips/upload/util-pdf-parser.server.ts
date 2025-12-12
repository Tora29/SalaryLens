import { PDFParse } from "pdf-parse";
import type { PayslipData } from "./schema";
import { PDF_LABEL_MAPPINGS } from "./schema";
import { timeStringToMinutes } from "./service";
import { createDefaultPayslipData } from "./service";

/**
 * PDFファイルからテキストを抽出する
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

/**
 * 値の型に応じてパースする
 */
function parseValue(
  value: string,
  type: "time" | "currency" | "decimal"
): number {
  switch (type) {
    case "time":
      return timeStringToMinutes(value);
    case "currency":
      return parseInt(value.replace(/,/g, ""), 10) || 0;
    case "decimal":
      return parseFloat(value) || 0;
  }
}

/**
 * 年月を抽出する（例: "2025(令和07)年11月25日支給分" → { year: 2025, month: 11 }）
 */
function extractYearMonth(text: string): { year: number; month: number } {
  // "年" と "月" の間の数字を探す
  const tokens = text.split(/\s+/);
  for (const token of tokens) {
    // "2025(令和07)年11月25日支給分" のようなパターン
    if (token.includes("年") && token.includes("月")) {
      const yearMatch = token.match(/^(\d{4})/);
      const monthMatch = token.match(/年(\d{1,2})月/);
      if (yearMatch && monthMatch) {
        return {
          year: parseInt(yearMatch[1], 10),
          month: parseInt(monthMatch[1], 10),
        };
      }
    }
  }
  return { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
}

/**
 * 合計を抽出する（支給合計と控除合計）
 * PDFでは表形式で「合計」行に対応する値が並んでいる
 * 実際のトークン構造: "11月30日" "143,812" "612,202" のように
 * 2つの連続した金額が控除合計、支給合計の順で並ぶ
 */
function extractTotals(tokens: string[]): {
  totalEarnings: number;
  totalDeductions: number;
} {
  // 「差引支給額:」より前の範囲で探す
  const netSalaryIndex = tokens.findIndex((t) => t === "差引支給額:");
  const endIndex = netSalaryIndex > 0 ? netSalaryIndex : tokens.length;

  // 金額パターン: カンマ区切りの数字（100,000形式）
  const currencyPattern = /^[\d,]+$/;
  const isLargeAmount = (s: string) => {
    const num = parseInt(s.replace(/,/g, ""), 10);
    // 10,000円以上を「合計金額らしい」と判定
    return num >= 10000;
  };

  // 2つの連続した金額を探す（10,000円以上の大きな金額が連続している場所）
  for (let i = 0; i < endIndex - 1; i++) {
    const first = tokens[i];
    const second = tokens[i + 1];
    if (
      first &&
      second &&
      currencyPattern.test(first) &&
      currencyPattern.test(second) &&
      isLargeAmount(first) &&
      isLargeAmount(second)
    ) {
      // PDF構造: 先に控除合計、後に支給合計の順で並んでいる
      return {
        totalDeductions: parseInt(first.replace(/,/g, ""), 10),
        totalEarnings: parseInt(second.replace(/,/g, ""), 10),
      };
    }
  }
  return { totalEarnings: 0, totalDeductions: 0 };
}

/**
 * PDFテキストを正規化する
 * 改行で分断されたラベルを結合する
 */
function normalizeText(text: string): string {
  return (
    text
      // "固定外残業時間(60\n時間超)" → "固定外残業時間(60時間超)"
      .replace(/\(60\s*\n\s*時間超\)/g, "(60時間超)")
      // "残業手当(60時間超\n)" → "残業手当(60時間超)"
      .replace(/\(60時間超\s*\n\s*\)/g, "(60時間超)")
  );
}

/**
 * 抽出したテキストから給与明細データをパースする
 * マッピングベースでラベルから値を取得
 */
export function parsePayslipText(text: string): PayslipData {
  const result = createDefaultPayslipData();

  // テキストを正規化
  const normalizedText = normalizeText(text);

  const { year, month } = extractYearMonth(normalizedText);
  result.year = year;
  result.month = month;

  // テキストをトークンに分割
  const tokens = normalizedText.split(/\s+/).filter((t) => t.length > 0);

  // マッピングのラベルリスト（長いものから順にマッチさせる）
  const labels = Object.keys(PDF_LABEL_MAPPINGS).sort(
    (a, b) => b.length - a.length
  );

  // トークンを順に処理してラベルを探す
  for (let i = 0; i < tokens.length; i++) {
    // 複合ラベル（複数トークンにまたがる）を先にチェック
    for (const label of labels) {
      const labelTokens = label.split(/\s+/);

      // 現在位置からラベルがマッチするか確認
      let matches = true;
      for (let j = 0; j < labelTokens.length; j++) {
        if (tokens[i + j] !== labelTokens[j]) {
          matches = false;
          break;
        }
      }

      // 単一トークンでのマッチも試す
      if (!matches && tokens[i] === label) {
        matches = true;
      }

      if (matches) {
        const mapping = PDF_LABEL_MAPPINGS[label];
        const valueIndex = i + label.split(/\s+/).length;
        const valueToken = tokens[valueIndex];

        if (valueToken && mapping) {
          const parsedValue = parseValue(valueToken, mapping.type);
          (result as Record<string, number>)[mapping.field] = parsedValue;
        }
        break;
      }
    }
  }

  // 合計は特別処理
  const totals = extractTotals(tokens);
  result.totalEarnings = totals.totalEarnings;
  result.totalDeductions = totals.totalDeductions;

  return result;
}

/**
 * PDFバッファから給与明細データを抽出する
 */
export async function parsePdfPayslip(buffer: Buffer): Promise<PayslipData> {
  const text = await extractTextFromPdf(buffer);
  return parsePayslipText(text);
}
