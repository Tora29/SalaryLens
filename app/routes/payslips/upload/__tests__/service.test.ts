import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isAllowedFileType,
  isImageFile,
  createDefaultPayslipData,
  extractPayslipFromFormData,
  timeStringToMinutes,
  minutesToTimeString,
} from "../service";

describe("isAllowedFileType", () => {
  it("正常系: PDF ファイルを許可する", () => {
    expect(isAllowedFileType("application/pdf")).toBe(true);
  });

  it("正常系: PNG 画像を許可する", () => {
    expect(isAllowedFileType("image/png")).toBe(true);
  });

  it("正常系: JPEG 画像を許可する", () => {
    expect(isAllowedFileType("image/jpeg")).toBe(true);
    expect(isAllowedFileType("image/jpg")).toBe(true);
  });

  it("異常系: 許可されていないファイル形式は拒否する", () => {
    expect(isAllowedFileType("text/plain")).toBe(false);
    expect(isAllowedFileType("application/json")).toBe(false);
    expect(isAllowedFileType("image/gif")).toBe(false);
    expect(isAllowedFileType("image/webp")).toBe(false);
  });

  it("エッジケース: 空文字列は拒否する", () => {
    expect(isAllowedFileType("")).toBe(false);
  });
});

describe("isImageFile", () => {
  it("正常系: image/ で始まるファイルタイプは true を返す", () => {
    expect(isImageFile("image/png")).toBe(true);
    expect(isImageFile("image/jpeg")).toBe(true);
    expect(isImageFile("image/gif")).toBe(true);
  });

  it("正常系: image/ で始まらないファイルタイプは false を返す", () => {
    expect(isImageFile("application/pdf")).toBe(false);
    expect(isImageFile("text/plain")).toBe(false);
  });

  it("エッジケース: 空文字列は false を返す", () => {
    expect(isImageFile("")).toBe(false);
  });
});

describe("createDefaultPayslipData", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("正常系: 現在の年月でデフォルトデータを生成する", () => {
    const data = createDefaultPayslipData();

    expect(data.year).toBe(2025);
    expect(data.month).toBe(6);
  });

  it("正常系: 指定した日付でデフォルトデータを生成する", () => {
    const data = createDefaultPayslipData(new Date("2024-12-01"));

    expect(data.year).toBe(2024);
    expect(data.month).toBe(12);
  });

  it("正常系: すべての数値フィールドが 0 で初期化される", () => {
    const data = createDefaultPayslipData();

    // 勤怠
    expect(data.extraOvertimeMinutes).toBe(0);
    expect(data.over60OvertimeMinutes).toBe(0);
    expect(data.nightOvertimeMinutes).toBe(0);
    expect(data.paidLeaveDays).toBe(0);
    expect(data.paidLeaveRemainingDays).toBe(0);

    // 支給
    expect(data.baseSalary).toBe(0);
    expect(data.totalEarnings).toBe(0);

    // 控除
    expect(data.healthInsurance).toBe(0);
    expect(data.totalDeductions).toBe(0);

    // 差引支給額
    expect(data.netSalary).toBe(0);
  });
});

describe("timeStringToMinutes", () => {
  it("正常系: HH:MM 形式を分に変換する", () => {
    expect(timeStringToMinutes("1:30")).toBe(90);
    expect(timeStringToMinutes("0:45")).toBe(45);
    expect(timeStringToMinutes("10:00")).toBe(600);
  });

  it("正常系: 0:00 は 0 を返す", () => {
    expect(timeStringToMinutes("0:00")).toBe(0);
  });

  it("正常系: 100 時間以上も処理できる", () => {
    expect(timeStringToMinutes("100:30")).toBe(6030);
  });

  it("異常系: 不正な形式は 0 を返す", () => {
    expect(timeStringToMinutes("invalid")).toBe(0);
    expect(timeStringToMinutes("")).toBe(0);
    expect(timeStringToMinutes("1:")).toBe(0);
    expect(timeStringToMinutes(":30")).toBe(0);
    expect(timeStringToMinutes("1-30")).toBe(0);
  });
});

describe("minutesToTimeString", () => {
  it("正常系: 分を HH:MM 形式に変換する", () => {
    expect(minutesToTimeString(90)).toBe("1:30");
    expect(minutesToTimeString(45)).toBe("0:45");
    expect(minutesToTimeString(600)).toBe("10:00");
  });

  it("正常系: 0 分は 0:00 を返す", () => {
    expect(minutesToTimeString(0)).toBe("0:00");
  });

  it("正常系: 分が1桁の場合は0埋めする", () => {
    expect(minutesToTimeString(65)).toBe("1:05");
    expect(minutesToTimeString(1)).toBe("0:01");
  });

  it("正常系: 100 時間以上も処理できる", () => {
    expect(minutesToTimeString(6030)).toBe("100:30");
  });
});

describe("extractPayslipFromFormData", () => {
  it("正常系: FormData から給与明細データを抽出できる", () => {
    const formData = new FormData();
    formData.set("year", "2025");
    formData.set("month", "6");
    formData.set("extraOvertimeMinutes", "1:30");
    formData.set("over60OvertimeMinutes", "0:00");
    formData.set("nightOvertimeMinutes", "0:30");
    formData.set("paidLeaveDays", "1");
    formData.set("paidLeaveRemainingDays", "10");
    formData.set("baseSalary", "300,000");
    formData.set("fixedOvertimeAllowance", "100,000");
    formData.set("overtimeAllowance", "30,000");
    formData.set("over60OvertimeAllowance", "0");
    formData.set("nightAllowance", "5,000");
    formData.set("specialAllowance", "10,000");
    formData.set("expenseReimbursement", "0");
    formData.set("commuteAllowance", "10,000");
    formData.set("stockIncentive", "0");
    formData.set("totalEarnings", "455,000");
    formData.set("healthInsurance", "20,000");
    formData.set("pensionInsurance", "40,000");
    formData.set("employmentInsurance", "3,000");
    formData.set("residentTax", "15,000");
    formData.set("incomeTax", "30,000");
    formData.set("stockContribution", "0");
    formData.set("totalDeductions", "108,000");
    formData.set("netSalary", "347,000");

    const result = extractPayslipFromFormData(formData);

    // 基本情報
    expect(result.year).toBe("2025");
    expect(result.month).toBe("6");

    // 勤怠（時間は分に変換）
    expect(result.extraOvertimeMinutes).toBe(90);
    expect(result.over60OvertimeMinutes).toBe(0);
    expect(result.nightOvertimeMinutes).toBe(30);

    // 支給（カンマ区切り文字列を数値に変換）
    expect(result.baseSalary).toBe(300000);
    expect(result.fixedOvertimeAllowance).toBe(100000);
    expect(result.totalEarnings).toBe(455000);

    // 控除
    expect(result.healthInsurance).toBe(20000);
    expect(result.totalDeductions).toBe(108000);

    // 差引支給額
    expect(result.netSalary).toBe(347000);
  });

  it("エッジケース: 存在しないフィールドは 0 または 0:00 として処理する", () => {
    const formData = new FormData();
    formData.set("year", "2025");
    formData.set("month", "1");

    const result = extractPayslipFromFormData(formData);

    // 時間フィールドは 0 に変換（"0:00" -> 0）
    expect(result.extraOvertimeMinutes).toBe(0);

    // 金額フィールドは 0
    expect(result.baseSalary).toBe(0);
    expect(result.netSalary).toBe(0);
  });
});
