# Custom Command: Create Pull Request

mainブランチから現在の変更を分析し、適切なブランチ名でPRを作成してください。

## 実行手順

### 1. 変更内容の分析
以下のコマンドで変更内容を確認してください：
- `git status` で変更ファイル一覧を確認
- `git diff main` でmainからの差分を確認（mainが存在しない場合は全変更を確認）

### 2. ブランチ名の決定
変更内容に基づいて、以下の規則でブランチ名を決定してください：
- 形式: `{type}/{short-description}`
- type: `feat`, `fix`, `refactor`, `docs`, `chore`, `test` のいずれか
- short-description: 変更内容を表す短い英語（kebab-case）
- 例: `feat/add-user-authentication`, `fix/login-validation-error`

### 3. ブランチ作成とコミット
- 決定したブランチ名で新しいブランチを作成
- 変更をステージングしてコミット（コミットメッセージも変更内容に基づいて決定）

### 4. PR作成
`gh pr create`を使用して、以下のテンプレートでPRを作成してください：

```
## What
<!-- 何を変更したか（箇条書き） -->

## Why
<!-- なぜこの変更が必要か -->

## How
<!-- どのように実装したか（技術的な説明） -->
```

### 5. 完了報告
作成したPRのURLをユーザーに報告してください。

## 注意事項
- コミットメッセージとPRタイトルは日本語で記述
- PRのbodyは日本語で記述
- ブランチ名は英語（kebab-case）
- 変更が大きい場合は、PRの説明を詳細に記述
