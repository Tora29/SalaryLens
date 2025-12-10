# Custom Command: Refactor to Service Layer

指定されたルートファイル (`routes/{name}/route.tsx`) 内のビジネスロジックを、コロケーションパターンに従ってサービスファイル (`server.ts`) とスキーマファイル (`schema.ts`) に切り出してください。

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
- ルートファイルと同じディレクトリに `server.ts` ファイルを作成してください（例: `routes/{name}/route.tsx` → `routes/{name}/server.ts`）。
- 型はスキーマファイルからインポートしてください。
- 以下の処理をサービス関数として切り出してください：
  - DB操作 (Prisma等)
  - 外部API呼び出し
  - 複雑なデータ加工ロジック

### 3. ルートファイルの修正
- スキーマとサービス関数をインポートして呼び出すだけの「コントローラー」に修正してください。
- `action` 内のバリデーションは `safeParse` を使用してください：

```typescript
const result = schema.safeParse({ /* formDataから取得した値 */ });

if (!result.success) {
  return { error: result.error.issues[0]?.message };
}

await serviceFunction(result.data);
```

- UIロジック（JSXなど）は変更しないでください。

## ファイル構成

```
app/routes/
  {name}/
    route.tsx        # ルート（コントローラー）
    server.ts        # サービス（ビジネスロジック）
    schema.ts        # Zodスキーマ + 型定義
```

## 注意点
- 既存の機能が壊れないように、引数と戻り値の型整合性を保ってください。
- 切り出した関数は、純粋な関数（Pure Function）または副作用が明確な関数として設計してください。

---
## 実行手順
まず、AskUserQuestion ツールを使ってユーザーに「リファクタリング対象のルートディレクトリを入力してください（例: app/routes/users）」と質問してください。
ユーザーから回答を得てから、上記のルールに従ってリファクタリングを開始してください。
