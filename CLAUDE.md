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
- スキーマ変更時: `prisma/schema/` 内の `.prisma` ファイルを編集 → `npx prisma db push`
- `db push` 実行時に Prisma Client も自動生成される
- シード実行: `npx prisma db seed`
  - シードファイル: `prisma/seeds/` 配下にテーブルごとに作成
  - エントリーポイント: `prisma/seeds/index.ts`
- 命名規則:
  - TypeScript 側: キャメルケース（`baseSalary`）
  - DB 側: スネークケース（`base_salary`）
  - `@map` でマッピング: `baseSalary Int @map("base_salary")`

## DB接続

- コンテナ起動: `docker compose up -d`
- コンテナ停止: `docker compose down`
- psql接続: `docker exec -it salary-lens-db psql -U postgres -d salary_lens`
- DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/salary_lens`
- DB完全初期化:
  ```bash
  docker compose down -v && docker compose up -d && npx prisma db push && npx prisma db seed
  ```

## 実装ルール

- 型ルール: `.claude/rules/type-management.md`
- レイヤー依存関係ルール: `.claude/rules/layer-dependencies.md`
- デザインルール: `.claude/skills/material-design/SKILL.md`
- Web標準ルール: `.claude/rules/web-standards.md`
- アイコンルール: `.claude/rules/icon-usage.md`
- バリデーションルール: `.claude/rules/validation.md`
- コンポーネント再利用ルール: `.claude/rules/component-reuse.md`
- コメントルール: ソースコード上のコメントは日本語で記述する
- 事実と推論を分けること
- 公式ドキュメントのリンクを示すこと
- 実装後は必ず`npm run lint`, `npm run format` を並行実行し確認を行う
