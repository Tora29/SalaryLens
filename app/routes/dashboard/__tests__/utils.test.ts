import { describe, it, expect } from "vitest";
import { formatCurrency } from "../utils";

describe("formatCurrency", () => {
  it("正常系: 正の金額を日本円形式でフォーマットできる", () => {
    expect(formatCurrency(300000)).toBe("￥300,000");
  });

  it("正常系: 大きな金額をカンマ区切りでフォーマットできる", () => {
    expect(formatCurrency(12345678)).toBe("￥12,345,678");
  });

  it("正常系: 0をフォーマットできる", () => {
    expect(formatCurrency(0)).toBe("￥0");
  });

  it("正常系: 負の金額をフォーマットできる", () => {
    expect(formatCurrency(-50000)).toBe("-￥50,000");
  });

  it("正常系: 小数点以下は切り捨てられる", () => {
    // maximumFractionDigits: 0 の設定により小数点以下は表示されない
    expect(formatCurrency(123456.78)).toBe("￥123,457");
  });

  it("エッジケース: 非常に大きな金額をフォーマットできる", () => {
    expect(formatCurrency(999999999999)).toBe("￥999,999,999,999");
  });
});
