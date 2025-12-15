// ライブラリ
import { data } from "react-router";
import { z } from "zod";

// 型定義
import type { LoaderData, SalaryRecord } from "./schema";

// サーバー・ロジック
import { calculateSummary, getRecentRecords } from "./service";

// 共有ライブラリ
import { prisma } from "~/shared/lib/db.server";

// ローカル
import { salaryRecordSchema } from "./schema";

/**
 * DBから給与レコードを取得する
 */
async function fetchSalaryRecords(): Promise<SalaryRecord[]> {
  const records = await prisma.salary.findMany({
    orderBy: [{ year: "asc" }, { month: "asc" }],
  });

  // Decimal型をnumber型に変換
  const convertedRecords = records.map((record) => ({
    ...record,
    paidLeaveDays: Number(record.paidLeaveDays),
    paidLeaveRemainingDays: Number(record.paidLeaveRemainingDays),
  }));

  // zodでバリデーション（スキーマ不一致を検知）
  const result = z.array(salaryRecordSchema).safeParse(convertedRecords);
  if (!result.success) {
    // eslint-disable-next-line no-console -- エラーログは開発時のデバッグに必要
    console.error("Validation failed:", result.error.issues);
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router の data() は意図的に throw する
    throw data("データ形式が不正です", { status: 500 });
  }

  return result.data;
}

/**
 * ダッシュボード用のデータを取得する
 */
export async function getDashboardData(): Promise<LoaderData> {
  const monthlySalaries = await fetchSalaryRecords();

  return {
    summary: calculateSummary(monthlySalaries),
    monthlySalaries,
    recentRecords: getRecentRecords(monthlySalaries, 5),
  };
}
