# バリデーションルール（zod + React Router）

## 基本方針

1. **バリデーションはサーバーサイド（action）で行う**
2. **HTML5 ネイティブバリデーションは使用しない**
3. **エラーメッセージは useActionData で取得して表示する**

---

## フォームの書き方

### required 属性は使用しない

`required` 属性を使用すると、ブラウザ標準のエラーメッセージが表示され、zod のカスタムメッセージが使われない。

```typescript
// Good - required なし、サーバーサイドで検証
<input type="text" name="title" />

// Bad - ブラウザ標準のエラーメッセージが表示される
<input type="text" name="title" required />
```

### onSubmit でモーダルを閉じない

エラー時にモーダルが閉じてしまい、エラーメッセージが表示されない。

```typescript
// Good - onSubmit なし、成功時は redirect で遷移
<Form method="post">

// Bad - エラーメッセージが表示される前にモーダルが閉じる
<Form method="post" onSubmit={onClose}>
```

---

## エラーメッセージの表示

### useActionData でエラーを取得

```typescript
import { Form, useActionData } from "react-router";
import type { Route } from "./+types/route";

function MyForm() {
  const actionData = useActionData<Route.ActionData>();
  const error = actionData && "error" in actionData ? actionData.error : null;

  return (
    <Form method="post">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <input type="text" name="title" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

---

## action でのバリデーション

### safeParse でエラーハンドリング

```typescript
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = createTodoSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    // エラーメッセージを返す（リダイレクトしない）
    return { error: result.error.issues[0]?.message };
  }

  // 成功時はリダイレクト
  await createTodo(result.data);
  return redirect("/todos");
}
```

---

## フロー図

```
フォーム送信
    │
    ├─ required 属性あり？
    │   └─ YES → ブラウザがバリデーション → 標準エラー表示（NG）
    │
    └─ required 属性なし？
        └─ YES → サーバーへ送信
                    │
                    ├─ zod バリデーション失敗
                    │   └─ { error: "メッセージ" } を返す
                    │       └─ useActionData で取得 → カスタムエラー表示
                    │
                    └─ zod バリデーション成功
                        └─ redirect() → ページ遷移
```

---

## 禁止事項

- `required`、`minlength`、`maxlength`、`pattern` などの HTML5 バリデーション属性を使用しない
- `onSubmit` でモーダルを閉じない（エラーが表示されなくなる）
- `noValidate` に頼らない（シンプルに属性を使わない方が良い）

---

## エラーハンドリングと ErrorBoundary

### try-catch は不要

React Router v7 では、action/loader 内で throw されたエラーは自動的に `ErrorBoundary` でキャッチされる。

```typescript
// Good - try-catch 不要
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = schema.safeParse({ title: formData.get("title") });
  if (!result.success) {
    return { error: result.error.issues[0]?.message };
  }

  await createTodo(result.data); // エラーは ErrorBoundary へ
  return redirect("/todos");
}

// Bad - 冗長な try-catch
export async function action({ request }: Route.ActionArgs) {
  try {
    // ...
  } catch (error) {
    return { error: "エラーが発生しました" };
  }
}
```

### エラーの分類

| エラー種別       | 処理方法                          | 例                 |
| ---------------- | --------------------------------- | ------------------ |
| 予期されるエラー | `return { error }`                | バリデーション失敗 |
| HTTP エラー      | `throw data(message, { status })` | 404 Not Found      |
| 予期しないエラー | そのまま throw                    | DB 障害            |

### ErrorBoundary の実装

各ルートで `ErrorBoundary` をエクスポートし、共通コンポーネントを使用する。

```typescript
import { RouteErrorBoundary } from "~/shared/components/RouteErrorBoundary";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorBoundary error={error} />;
}
```

`RouteErrorBoundary` は `isRouteErrorResponse` で HTTP エラーとその他のエラーを分岐処理する。

---

## メッセージの管理方針

### 用途による使い分け

| 用途             | 方法                   | 理由                     |
| ---------------- | ---------------------- | ------------------------ |
| DB データ検証    | カスタムメッセージ不要 | 開発者向け（英語で十分） |
| フォーム入力検証 | スキーマ内に直接書く   | ユーザー向け（日本語）   |
| UI メッセージ    | MESSAGES 定数          | 複数箇所で使う           |

### フォーム検証: スキーマ内に直接書く

ユーザー入力のバリデーションエラーは、スキーマ定義内に日本語メッセージを直接書く。

```typescript
// フォーム検証用スキーマ
export const payslipSchema = z.object({
  year: z.coerce
    .number()
    .min(2000, "2000年以降を指定してください")
    .max(2100, "2100年以前を指定してください"),
  month: z.coerce
    .number()
    .min(1, "月は1〜12で指定してください")
    .max(12, "月は1〜12で指定してください"),
});
```

### DB 検証: カスタムメッセージ不要

DB から取得したデータの検証は開発者向けなので、zod デフォルトメッセージのまま。

```typescript
// DB検証用スキーマ（カスタムメッセージなし）
export const salaryRecordSchema = z.object({
  year: z.number(),
  month: z.number().min(1).max(12),
  baseSalary: z.number().nonnegative(),
});
```

### UI メッセージ: MESSAGES 定数

複数箇所で使う UI メッセージは `schema.ts` に `MESSAGES` 定数として定義する。

```typescript
// schema.ts
export const MESSAGES = {
  error: {
    invalidDataFormat: "データ形式が不正です",
  },
  empty: {
    noRecords: "給与明細がありません",
    noRecordsForYear: (year: number) => `${year}年の給与明細がありません`,
  },
} as const;
```

```typescript
// server.ts
throw data(MESSAGES.error.invalidDataFormat, { status: 500 });

// route.tsx
<EmptyState message={MESSAGES.empty.noRecords} />
```
