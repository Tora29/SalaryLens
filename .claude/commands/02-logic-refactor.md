---
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
description: "ルートファイルのロジックをservice/server/schemaに分割します"
---

# Custom Command: Refactor to Service Layer

指定されたルートファイル (`routes/{name}/route.tsx`) 内のロジックを、コロケーションパターンに従って `server.ts`、`service.ts`、`schema.ts` に切り出してください。

## リファクタリング手順

### 1. スキーマファイルの作成

- ルートファイルと同じディレクトリに `schema.ts` ファイルを作成してください（例: `routes/{name}/route.tsx` → `routes/{name}/schema.ts`）。
- zodを使用してスキーマを定義し、型は `z.infer` で推論してください。

```typescript
import { z } from "zod";

// エンティティスキーマ
export const entitySchema = z.object({
  id: z.string(),
  // ... 他のフィールド
});

// 入力用スキーマ（バリデーション付き）
export const createEntitySchema = z.object({
  // 必須フィールドには .min() 等でバリデーションを追加
});

export const updateEntitySchema = z.object({
  id: z.string(),
  // ... 更新対象フィールド
});

// 型はスキーマから推論
export type Entity = z.infer<typeof entitySchema>;
export type CreateEntityInput = z.infer<typeof createEntitySchema>;
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;
```

### 2. サービスファイルの作成

- ルートファイルと同じディレクトリに `service.ts` ファイルを作成してください。
- **純粋関数**としてビジネスロジックを実装してください（DBや外部APIに依存しない）。
- テスト容易性を確保するため、副作用を持たない関数として設計してください。

```typescript
import type { Entity, SummaryData } from "./schema";

// 集計・計算ロジック
export function calculateSummary(records: Entity[]): SummaryData {
  // ...
}

// データ変換・フィルタリングロジック
export function filterActiveRecords(records: Entity[]): Entity[] {
  // ...
}
```

### 3. サーバーファイルの作成

- ルートファイルと同じディレクトリに `server.ts` ファイルを作成してください。
- **DBアクセス**や**外部API呼び出し**などの副作用を持つ処理を実装してください。
- `service.ts` の関数を呼び出してデータを組み立ててください。

```typescript
import { data } from "react-router";
import { z } from "zod";
import { prisma } from "~/shared/lib/db.server";
import type { Entity, LoaderData } from "./schema";
import { entitySchema } from "./schema";
import { calculateSummary } from "./service";

// DBアクセス
async function fetchEntities(): Promise<Entity[]> {
  const records = await prisma.entity.findMany();

  // zodでバリデーション（スキーマ不一致を検知）
  const result = z.array(entitySchema).safeParse(records);
  if (!result.success) {
    console.error("Validation failed:", result.error.issues);
    throw data("データ形式が不正です", { status: 500 });
  }

  return result.data;
}

// ローダー用データ取得
export async function getLoaderData(): Promise<LoaderData> {
  const entities = await fetchEntities();
  return {
    summary: calculateSummary(entities),
    entities,
  };
}
```

### 4. ルートファイルの修正

- スキーマとサーバー関数をインポートして呼び出すだけの「コントローラー」に修正してください。
- `action` 内のバリデーションは `safeParse` を使用してください：

```typescript
const result = schema.safeParse({
  /* formDataから取得した値 */
});

if (!result.success) {
  return { error: result.error.issues[0]?.message };
}

await serviceFunction(result.data);
```

- UIロジック（JSXなど）は変更しないでください。

### 5. ErrorBoundary の追加

- `route.tsx` に `ErrorBoundary` をエクスポートしてください。
- `isRouteErrorResponse` で `data()` によるエラーと予期しないエラーを判別してください。

```typescript
import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/route";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    // data() で投げたエラー（404, 500等）
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.data}</p>
      </div>
    );
  }

  // 予期しないエラー（DB障害、バグ等）
  return (
    <div>
      <h1>エラー</h1>
      <p>予期しないエラーが発生しました</p>
    </div>
  );
}
```

## ファイル構成

```
app/routes/
  {name}/
    route.tsx        # ルート（コントローラー）
    server.ts        # DBアクセス・外部API呼び出し
    service.ts       # ビジネスロジック（純粋関数）
    schema.ts        # Zodスキーマ + 型定義
```

## 注意点

- 既存の機能が壊れないように、引数と戻り値の型整合性を保ってください。
- `service.ts` の関数は純粋関数として設計し、DBモックなしでテスト可能にしてください。
- `server.ts` の関数は副作用が明確な関数として設計してください。

---

## 実行手順

まず、AskUserQuestion ツールを使ってユーザーに「リファクタリング対象のルートディレクトリを入力してください（例: app/routes/users）」と質問してください。
ユーザーから回答を得てから、上記のルールに従ってリファクタリングを開始してください。
