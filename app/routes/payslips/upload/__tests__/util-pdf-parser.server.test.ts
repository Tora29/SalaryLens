import { describe, it, expect, vi, beforeEach } from "vitest";

// pdf-parse をモック
const { mockGetText, mockDestroy } = vi.hoisted(() => ({
  mockGetText: vi.fn(),
  mockDestroy: vi.fn(),
}));

vi.mock("pdf-parse", () => ({
  PDFParse: vi.fn().mockImplementation(() => ({
    getText: mockGetText,
    destroy: mockDestroy,
  })),
}));

import { parsePayslipText } from "../util-pdf-parser.server";

describe("parsePayslipText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("年月の抽出", () => {
    it("正常系: 年月を抽出できる", () => {
      const text = "2025(令和07)年11月25日支給分 その他のテキスト";

      const result = parsePayslipText(text);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
    });

    it("正常系: 異なる年月フォーマットでも抽出できる", () => {
      const text = "2024(令和06)年3月20日支給分 テスト";

      const result = parsePayslipText(text);

      expect(result.year).toBe(2024);
      expect(result.month).toBe(3);
    });

    it("エッジケース: 年月が見つからない場合は現在日付を使用", () => {
      const text = "テキストのみ 年月情報なし";

      const result = parsePayslipText(text);

      // 現在の年月がセットされる
      expect(result.year).toBeGreaterThanOrEqual(2024);
      expect(result.month).toBeGreaterThanOrEqual(1);
      expect(result.month).toBeLessThanOrEqual(12);
    });
  });

  describe("勤怠フィールドの抽出", () => {
    it("正常系: 固定外残業時間を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 固定外残業時間 15:30 テスト";

      const result = parsePayslipText(text);

      expect(result.extraOvertimeMinutes).toBe(930); // 15 * 60 + 30
    });

    it("正常系: 深夜割増時間を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 深夜割増時間 2:15 テスト";

      const result = parsePayslipText(text);

      expect(result.nightOvertimeMinutes).toBe(135); // 2 * 60 + 15
    });

    it("正常系: 有休日数を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 有休日数 2.5 テスト";

      const result = parsePayslipText(text);

      expect(result.paidLeaveDays).toBe(2.5);
    });

    it("正常系: 有休残日数を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 有休残日数 15.0 テスト";

      const result = parsePayslipText(text);

      expect(result.paidLeaveRemainingDays).toBe(15);
    });
  });

  describe("支給フィールドの抽出", () => {
    it("正常系: 基本給を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 基本給(月給) 300,000 テスト";

      const result = parsePayslipText(text);

      expect(result.baseSalary).toBe(300000);
    });

    it("正常系: 残業手当を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 残業手当 45,000 テスト";

      const result = parsePayslipText(text);

      expect(result.overtimeAllowance).toBe(45000);
    });

    it("正常系: 固定時間外手当を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 固定時間外手当 100,000 テスト";

      const result = parsePayslipText(text);

      expect(result.fixedOvertimeAllowance).toBe(100000);
    });
  });

  describe("控除フィールドの抽出", () => {
    it("正常系: 健康保険料を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 健康保険料 15,000 テスト";

      const result = parsePayslipText(text);

      expect(result.healthInsurance).toBe(15000);
    });

    it("正常系: 厚生年金保険を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 厚生年金保険 30,000 テスト";

      const result = parsePayslipText(text);

      expect(result.pensionInsurance).toBe(30000);
    });

    it("正常系: 所得税を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 所得税 25,000 テスト";

      const result = parsePayslipText(text);

      expect(result.incomeTax).toBe(25000);
    });
  });

  describe("差引支給額の抽出", () => {
    it("正常系: 差引支給額を抽出できる", () => {
      const text = "2025(令和07)年6月支給分 差引支給額: 350,000 テスト";

      const result = parsePayslipText(text);

      expect(result.netSalary).toBe(350000);
    });
  });

  describe("合計の抽出", () => {
    it("正常系: 支給合計と控除合計を抽出できる", () => {
      // PDF 構造: 控除合計、支給合計の順で大きな金額が並ぶ
      const text =
        "2025(令和07)年6月支給分 11月30日 108,000 455,000 差引支給額: 347,000";

      const result = parsePayslipText(text);

      expect(result.totalDeductions).toBe(108000);
      expect(result.totalEarnings).toBe(455000);
    });
  });

  describe("テキスト正規化", () => {
    it("正常系: 改行で分断された 60時間超 ラベルを処理できる", () => {
      const text =
        "2025(令和07)年6月支給分 固定外残業時間(60時間超) 1:00 テスト";

      const result = parsePayslipText(text);

      expect(result.over60OvertimeMinutes).toBe(60);
    });
  });

  describe("複合テスト", () => {
    it("正常系: 複数のフィールドを同時に抽出できる", () => {
      // 実際のPDF構造に近いテストデータ
      // 合計行は「控除合計 支給合計」の順で連続した大きな金額として現れる
      // extractTotals は差引支給額より前で、連続した >= 10,000 の金額を探す
      const text = `
        2025(令和07)年6月25日支給分
        固定外残業時間 15:30
        深夜割増時間 2:00
        有休日数 1.5
        有休残日数 12.0
        基本給(月給) 300,000
        固定時間外手当 100,000
        残業手当 45,000
        健康保険料 5,000
        厚生年金保険 8,000
        所得税 9,000
        合計行 108,000 455,000
        差引支給額: 347,000
      `;

      const result = parsePayslipText(text);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(6);
      expect(result.extraOvertimeMinutes).toBe(930);
      expect(result.nightOvertimeMinutes).toBe(120);
      expect(result.paidLeaveDays).toBe(1.5);
      expect(result.paidLeaveRemainingDays).toBe(12);
      expect(result.baseSalary).toBe(300000);
      expect(result.fixedOvertimeAllowance).toBe(100000);
      expect(result.overtimeAllowance).toBe(45000);
      expect(result.healthInsurance).toBe(5000);
      expect(result.pensionInsurance).toBe(8000);
      expect(result.incomeTax).toBe(9000);
      expect(result.totalDeductions).toBe(108000);
      expect(result.totalEarnings).toBe(455000);
      expect(result.netSalary).toBe(347000);
    });
  });

  describe("エッジケース", () => {
    it("空のテキストでもデフォルト値を返す", () => {
      const result = parsePayslipText("");

      expect(result.baseSalary).toBe(0);
      expect(result.netSalary).toBe(0);
      expect(result.totalEarnings).toBe(0);
      expect(result.totalDeductions).toBe(0);
    });

    it("関係ないテキストでもデフォルト値を返す", () => {
      const text = "これは給与明細とは関係のないテキストです。";

      const result = parsePayslipText(text);

      expect(result.baseSalary).toBe(0);
      expect(result.netSalary).toBe(0);
    });
  });
});
