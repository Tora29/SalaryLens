// React・ライブラリ
import { data } from "react-router";
import { z } from "zod";

// 型定義
import type { LoaderData, SalaryRecord } from "./schema";

// サーバー・ロジック
import { MESSAGES, salaryRecordSchema } from "./schema";

// 共有コンポーネント
import { prisma } from "~/shared/lib/db.server";

/**
 * 利用可能な年のリストを取得
 */
async function fetchAvailableYears(): Promise<number[]> {
  const yearsResult = await prisma.salary.groupBy({
    by: ["year"],
    orderBy: { year: "desc" },
  });
  return yearsResult.map((r) => r.year);
}

/**
 * 給与レコードを取得し、バリデーションを行う
 */
async function fetchSalaryRecords(
  selectedYear: number | "all"
): Promise<SalaryRecord[]> {
  const isAllYears = selectedYear === "all";

  // 検索条件を構築（型ガードを明示的に行う）
  const whereCondition = isAllYears ? {} : { year: selectedYear };
  const orderByCondition = isAllYears
    ? [{ year: "desc" as const }, { month: "desc" as const }]
    : { month: "asc" as const };

  const records = await prisma.salary.findMany({
    where: whereCondition,
    orderBy: orderByCondition,
  });

  // Decimal型をnumber型に変換
  const convertedRecords = records.map((record) => ({
    ...record,
    paidLeaveDays: Number(record.paidLeaveDays),
    paidLeaveRemainingDays: Number(record.paidLeaveRemainingDays),
  }));

  // zodでバリデーション
  const result = z.array(salaryRecordSchema).safeParse(convertedRecords);
  if (!result.success) {
    // eslint-disable-next-line no-console -- エラーログは開発時のデバッグに必要
    console.error("Validation failed:", result.error.issues);
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router の data() は意図的に throw する
    throw data(MESSAGES.error.invalidDataFormat, { status: 500 });
  }

  return result.data;
}

/**
 * リクエストURLから選択された年を解析
 */
function parseSelectedYear(url: URL, availableYears: number[]): number | "all" {
  const yearParam = url.searchParams.get("year");
  const isAllYears = yearParam === "all";

  if (isAllYears) {
    return "all";
  }

  if (yearParam) {
    return Number(yearParam);
  }

  return availableYears[0] ?? new Date().getFullYear();
}

/**
 * Loader用データを取得
 */
export async function getLoaderData(request: Request): Promise<LoaderData> {
  const url = new URL(request.url);

  const availableYears = await fetchAvailableYears();
  const selectedYear = parseSelectedYear(url, availableYears);
  const records = await fetchSalaryRecords(selectedYear);

  return {
    records,
    selectedYear,
    availableYears,
  };
}
