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
