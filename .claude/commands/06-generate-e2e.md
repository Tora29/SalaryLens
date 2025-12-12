---
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(npx playwright:*)
description: "Playwright Test Agents でE2Eテストを計画・生成・修復します"
---

Playwright Test Agents として E2E テストを作成・管理します。

## モード選択

ユーザーの指示に応じて以下のモードで動作：

### 1. Plan モード（テスト計画作成）

**トリガー**: 「計画」「plan」「仕様」などのキーワード

アプリを探索し、マークダウン形式のテスト計画を生成：

1. 対象機能のルート・コンポーネントを特定
2. ユーザーフローを分析
3. `specs/[機能名].md` に出力

**出力形式**:

```markdown
# [機能名] テスト計画

## 前提条件

- ログイン状態、初期データなど

## シナリオ1: [シナリオ名]

**ステップ:**

1. [操作]
2. [操作]
   **期待結果:** [検証内容]
```

### 2. Generate モード（テストコード生成）

**トリガー**: 「生成」「generate」「コード」などのキーワード

テスト計画からPlaywrightテストを生成：

1. `specs/` からテスト計画を読み込む
2. セレクタとアサーションを実装
3. `e2e/[機能名].spec.ts` に出力

**出力形式**:

```typescript
import { test, expect } from "@playwright/test";

test.describe("[機能名]", () => {
  test("[シナリオ名]", async ({ page }) => {
    // ステップ実装
  });
});
```

### 3. Heal モード（テスト修復）

**トリガー**: 「修復」「heal」「失敗」「fix」などのキーワード

失敗したテストを自動修復：

1. 失敗したテストファイルを特定
2. エラーメッセージを分析
3. ロケータ・待機時間を修正
4. 再実行して確認

## プロジェクト構造

```
specs/           # テスト計画（マークダウン）
e2e/
  seed.spec.ts   # 環境初期化
  *.spec.ts      # E2Eテスト
```

## 実行コマンド

```bash
# テスト実行
npx playwright test

# 特定ファイル実行
npx playwright test e2e/[ファイル名].spec.ts

# UIモード
npx playwright test --ui

# レポート表示
npx playwright show-report
```

## seed.spec.ts テンプレート

初回は以下を `e2e/seed.spec.ts` に作成：

```typescript
import { test } from "@playwright/test";

test("seed", async ({ page }) => {
  // アプリの初期状態をセットアップ
  await page.goto("/");
  // 必要に応じて認証・データ準備
});
```

## 注意事項

- セレクタは `getByRole`, `getByText` を優先
- `data-testid` は最終手段
- 待機は暗黙的待機を活用（明示的 `waitFor` は最小限）
- スクリーンショットは失敗時のみ
