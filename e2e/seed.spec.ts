import { test, expect } from "@playwright/test";

// 環境初期化用のシードテスト
// 全てのテストで共通の初期状態をセットアップ
test("seed", async ({ page }) => {
  await page.goto("/");
  // アプリが正常に起動することを確認
  await expect(page).toHaveTitle(/SalaryLens/);
});
