---
allowed-tools: Bash(git:*), AskUserQuestion
description: "worktreeと作業ブランチをクリーンアップします"
---

# Custom Command: End Development

開発が完了した worktree と作業ブランチをクリーンアップします。

## 前提条件

- PR がマージ済みであること
- 現在の worktree で作業が完了していること

## 実行手順

### 1. 現在の状態確認

```bash
git status
git worktree list
```

現在いる worktree のパスとブランチ名を確認してください。

### 2. 未コミットの変更確認

未コミットの変更がある場合は、ユーザーに警告してください：

「未コミットの変更があります。クリーンアップを続行しますか？」

### 3. ユーザーへの案内

以下の形式で案内を出力してください：

```
🧹 Worktree クリーンアップ手順

現在のディレクトリ: {現在のパス}
ブランチ: {現在のブランチ}

このセッションを終了し、メインリポジトリで以下を実行してください:

1. Claude を終了（Ctrl+C または /exit）

2. メインリポジトリに移動:
   cd ../SalaryLens

3. Worktree を削除:
   git worktree remove ../SalaryLens-{機能名}

4. ブランチを削除（必要に応じて）:
   git branch -d feat/{機能名}

5. 確認:
   git worktree list
   git branch -a
```

## 注意事項

- worktree 内から自分自身を削除することはできない
- 必ずメインリポジトリから削除コマンドを実行する
- PR がマージされていない場合は警告を出す
