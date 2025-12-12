---
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion
description: "コロケーションのメリットを活かして設計書を作成します"
---

# Custom Command: Generate Design Document

あなたは経験豊富なシニアエンジニアです。
コロケーションベースのルートディレクトリを解析し、Markdown + Mermaid形式の設計書を生成してください。

## 実行手順

### Step 1: 対象ルートの確認

AskUserQuestion ツールを使ってユーザーに「設計書を作成するルートのパスを入力してください（例: app/routes/dashboard）」と質問してください。

### Step 2: ファイル解析

指定されたディレクトリ内の全ファイルを動的に取得してください：

1. **ファイル一覧取得**: Glob ツールで `{対象ディレクトリ}/**/*` を実行し、全ファイルを取得
2. **ファイル分類**: 取得したファイルを以下のカテゴリに分類
   - ルートファイル: `route.tsx`
   - サーバー層: `server.ts`, `*.server.ts`
   - ビジネスロジック層: `service.ts`
   - バリデーション: `schema.ts`
   - ユーティリティ: `utils.ts`, `util-*.ts`, `helpers.ts`
   - 型定義: `types.ts`
   - 定数: `constants.ts`
   - コンポーネント: `components/*.tsx`
   - フック: `hooks/*.ts`
   - テスト: `__tests__/**/*`
3. **ファイル読み込み**: テストファイル以外の全ファイルを Read ツールで読み込む

### Step 3: 設計書の生成

以下の構成で Markdown ファイルを生成してください。

**出力先ルール:**
- ベースディレクトリ: `docs/design/`
- 実装と同じ構造を維持する
- 例: `app/routes/dashboard/` → `docs/design/app/routes/dashboard/DESIGN.md`
- 例: `app/routes/payslips/upload/` → `docs/design/app/routes/payslips/upload/DESIGN.md`

必要に応じてディレクトリを作成すること。

---

## 設計書テンプレート

```markdown
# {機能名} 設計書

> 自動生成日: {YYYY-MM-DD}
> 対象ディレクトリ: `{パス}`

## 1. 機能概要

{route.tsx のコメントやコンポーネント名から推測した機能の説明}

### ユースケース

- {主要なユースケースをリストアップ}

## 2. ファイル構成

{Glob で取得した全ファイルを元に動的にテーブルを生成}

| ファイル | カテゴリ | 説明 |
|---------|---------|------|
| `route.tsx` | UI層 | {説明} |
| `server.ts` | サーバー層 | {説明} |
| `service.ts` | ビジネスロジック層 | {説明} |
| `schema.ts` | バリデーション | {説明} |
| `util-*.server.ts` | ユーティリティ | {説明} |
| `components/*.tsx` | 子コンポーネント | {説明} |
| ... | ... | {存在するファイルを全て列挙} |

## 3. データフロー

\`\`\`mermaid
flowchart TD
    subgraph Client
        UI[route.tsx]
        C1[Component1]
        C2[Component2]
    end

    subgraph Server
        L[loader]
        A[action]
        SV[server.ts]
        SVC[service.ts]
    end

    subgraph Database
        DB[(PostgreSQL)]
    end

    UI --> C1
    UI --> C2
    L --> SV
    SV --> SVC
    SVC --> DB
    A --> SV
\`\`\`

{実際のデータの流れを解析して図を更新}

## 4. 型定義

### スキーマ（schema.ts）

\`\`\`typescript
{schema.ts の主要な型定義を抜粋}
\`\`\`

### Props 型

{各コンポーネントの Props 型をリストアップ}

## 5. コンポーネント階層

\`\`\`mermaid
graph TD
    Route[route.tsx]
    Route --> C1[Component1]
    Route --> C2[Component2]
    C1 --> C1a[SubComponent]
\`\`\`

{実際のコンポーネント構造を解析して図を更新}

## 6. DB操作

| 操作 | 関数名 | テーブル | 説明 |
|------|--------|---------|------|
| READ | {関数名} | {テーブル} | {説明} |
| CREATE | {関数名} | {テーブル} | {説明} |

## 7. 外部依存

### 共有モジュール

- `~/shared/...` からのインポート一覧

### 外部ライブラリ

- {使用しているライブラリ}

## 8. テストカバレッジ

| ファイル | テストファイル | 状態 |
|---------|---------------|------|
| `server.ts` | `__tests__/server.test.ts` | ✅ |
| `service.ts` | `__tests__/service.test.ts` | ✅ |
| `Component1` | `__tests__/components/Component1.test.tsx` | ✅ |
| `Component2` | - | ❌ 未作成 |

## 9. 関連ドキュメント

- [React Router v7 ドキュメント](https://reactrouter.com/)
- [プロジェクトルール](/.claude/rules/)
```

---

## 注意事項

1. **Mermaid図は実際のコードを解析して正確に描画すること**
2. **型定義は重要なものだけを抜粋し、冗長にならないようにすること**
3. **テストカバレッジは実際のファイル有無を確認すること**
4. **日本語で記述すること**
5. **推測で書いた部分は `{推測}` と明記すること**
