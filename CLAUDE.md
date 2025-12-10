# CLAUDE.md

## アーキテクチャ

- UI ライブラリ: React 19
- フレームワーク: React Router v7
- スタイリング: Tailwind CSS v4
- バリデーション: zod
- ORM: Prisma
- アイコン: lucide
- ディレクトリ: コロケーション

## Prisma 開発ワークフロー

- マイグレーションファイルは使用しない
- スキーマ変更時: `prisma/schema.prisma` を直接編集 → `npx prisma db push`
- `db push` 実行時に Prisma Client も自動生成される

## DB接続

- コンテナ起動: `docker compose up -d`
- コンテナ停止: `docker compose down`
- psql接続: `docker exec -it salary-lens-db psql -U postgres -d salary_lens`
- DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/salary_lens`

## 実装ルール

- 型ルール: `.claude/rules/type-management.md`
- デザインルール: `.claude/skills/material-design/SKILL.md`
- Web標準ルール: `.claude/rules/web-standards.md`
- アイコンルール: `.claude/rules/icon-usage.md`
- バリデーションルール: `.claude/rules/validation.md`
- コメントルール: ソースコード上のコメントは日本語で記述する
- 事実と推論を分けること
- 公式ドキュメントのリンクを示すこと
- 実装後は必ず`npm run lint`, `npm run format` を並行実行し確認を行う
