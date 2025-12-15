---
allowed-tools: Bash(git:*), Bash(cp:*), Bash(npm:*), Bash(docker:*), Bash(npx:*), AskUserQuestion
description: "git worktreeを作成して並行開発環境を準備します"
---

# Custom Command: Create Worktree

並行開発用の git worktree を作成し、新しい開発環境を準備します。

## 実行手順

### 1. 機能名の確認

AskUserQuestion ツールを使って、ユーザーに以下を質問してください：

「作成する機能名を入力してください（例: payslips, settings, auth）」

※ この機能名がブランチ名とディレクトリ名に使用されます。

### 2. Worktree の作成

以下のコマンドで worktree を作成してください：

```bash
git worktree add -b feat/{機能名} ../{リポジトリ名}-{機能名}
```

例: 機能名が `payslips` の場合

```bash
git worktree add -b feat/payslips ../SalaryLens-payslips
```

### 3. 作成結果の確認

```bash
git worktree list
```

### 4. 環境構築

新しい worktree ディレクトリで以下のコマンドを順番に実行してください：

#### 4.1 環境変数ファイルのコピー

```bash
cp .env ../SalaryLens-{機能名}/.env
```

#### 4.2 依存パッケージのインストール

```bash
npm install --prefix ../SalaryLens-{機能名}
```

#### 4.3 データベースの起動確認

```bash
docker compose -f ../SalaryLens-{機能名}/docker-compose.yml up -d
```

#### 4.4 Prisma Client の生成とスキーマ同期

```bash
cd ../SalaryLens-{機能名} && npx prisma db push
```

※ `npx` には `--prefix` オプションがないため、ディレクトリ移動が必要です。

### 5. ユーザーへの案内

以下の形式で案内を出力してください：

```
✅ Worktree を作成し、環境構築が完了しました

📁 ディレクトリ: ../SalaryLens-{機能名}
🌿 ブランチ: feat/{機能名}

次のステップ:
1. 新しいターミナル（または tmux ペイン）を開く
2. 以下のコマンドを実行:

   cd ../SalaryLens-{機能名} && claude

3. 開発を開始

開発完了後は /09-end-dev でクリーンアップできます。
```

## 注意事項

- 既存の worktree と重複しないよう、事前に `git worktree list` で確認する
- main ブランチから派生させる（現在のブランチが main でない場合は警告を出す）
