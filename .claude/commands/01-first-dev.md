---
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion, Bash(npm run:*), Bash(npx prisma:*)
description: "React Router v7でルートを新規作成します"
---

# Custom Command: Scaffold Feature (React Router v7)

あなたは経験豊富なシニアフロントエンドエンジニアです。
React Router v7 のベストプラクティスに基づき、指定された機能を実装してください。

## 前提ルール (Strict Rules)

1. **Co-location (コロケーション) 優先:**
   - `app/routes/{name}/route.tsx` にルートファイルを作成し、全てのコード（UI, loader, action, types）を含めてください。
   - この段階では、ファイルを分割しないでください。

2. **データフロー:**
   - データ取得は `loader` 関数で行ってください。
   - データ更新は `action` 関数で行ってください。
   - クライアントサイドでの `useEffect` によるデータ取得は極力避けてください。

3. **スタイリング:**
   - Tailwind CSS を使用してください。
   - レスポンシブ対応、およびダークモード（プロジェクト設定にあれば）を考慮してください。

4. **型安全性:**
   - `Route.ComponentProps`, `Route.LoaderArgs`, `Route.ActionArgs` などの型定義ヘルパーを使用してください。

## 出力要件

- 実装する機能の要件に基づき、完全な `.tsx` コードを出力してください。
- 必要な `import` 文を全て含めてください。
- `zod` などのバリデーションライブラリがプロジェクトにある場合は使用してください。

---

## 実行手順

まず、AskUserQuestion ツールを使ってユーザーに「作成したい機能の概要を入力してください」と質問してください。
ユーザーから回答を得てから、上記のルールに従って実装を開始してください。
