# 型管理ルール（zod + React Router）

## 基本方針

1. **表示用の型は React Router +types から取得する**
2. **入力バリデーションには zod を使用する**
3. **型の二重定義を避ける**

---

## React Router +types の使い方

### loaderData / actionData の型

React Router が自動生成する型を使用する。`as` によるアサーションは使用しない。

```typescript
// Good
export default function Page({ loaderData }: Route.ComponentProps) {
  const { items, query } = loaderData;
}

// Bad - asアサーションは使用しない
export default function Page({ loaderData }: Route.ComponentProps) {
  const { items, query } = loaderData as { items: Item[]; query: string };
}
```

### 子コンポーネント用の型

loaderData から型を抽出する。

```typescript
// loaderData の要素型を取得
type Item = Route.ComponentProps["loaderData"]["items"][number];

// 子コンポーネントで使用
function ItemCard({ item }: { item: Item }) {
  return <div>{item.name}</div>;
}
```

---

## zod の使い方

### 用途

zod は **入力データのバリデーション** に使用する。

- action での formData 検証
- 外部 API レスポンスの検証
- 環境変数の検証

### スキーマ定義

```typescript
import { z } from "zod";

// 入力用スキーマ（バリデーション付き）
export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export const updateItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

// 型はスキーマから推論（バリデーション済みデータ用）
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
```

### action での使用

```typescript
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = createItemSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }

  // result.data は CreateItemInput 型
  await createItem(result.data);
  return { success: true };
}
```

---

## 役割分担

| 用途                     | 使う型                          |
| ------------------------ | ------------------------------- |
| loaderData の型          | React Router +types（自動推論） |
| actionData の型          | React Router +types（自動推論） |
| 子コンポーネントの props | +types から抽出                 |
| action のバリデーション  | zod スキーマ                    |
| サービス関数の引数       | zod から推論した型              |

---

## ファイル構成（コロケーション）

```
app/routes/
  {name}/
    route.tsx       # ルート（コントローラー）
    server.ts       # サービス（ビジネスロジック）
    schema.ts       # Zodスキーマ + 入力型
```

---

## 禁止事項

- `loaderData as SomeType` のような型アサーションは使用しない
- 同じ型を zod と手動で二重定義しない
- 表示用の型（loaderData の要素型）を zod で定義しない

---

## 判断フローチャート

```
型が必要
    │
    ├─ loaderData / actionData の型？
    │   └─ YES → Route.ComponentProps から取得
    │
    ├─ 子コンポーネントの props 型？
    │   └─ YES → Route.ComponentProps["loaderData"]["xxx"] から抽出
    │
    ├─ action の入力バリデーション？
    │   └─ YES → zod スキーマ + safeParse
    │
    ├─ サービス関数の引数型？
    │   └─ YES → zod から z.infer で推論
    │
    └─ それ以外 → 都度判断
```
