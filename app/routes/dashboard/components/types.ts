// 型定義
import type { Route } from "../+types/route";

/** 月次給与データの型（loaderData から抽出） */
export type MonthlySalary =
  Route.ComponentProps["loaderData"]["monthlySalaries"][number];
