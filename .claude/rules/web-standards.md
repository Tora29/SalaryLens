# Web 標準ルール（React Router v7）

## 基本方針

1. **URL = アプリケーションの状態**（Single Source of Truth）
2. **useState より searchParams を優先する**
3. **Progressive Enhancement を意識する**

---

## URL で状態を管理する

### モーダル・ダイアログの開閉

useState ではなく URL パラメータで管理する。

```typescript
// Good - URL で状態管理
const [searchParams, setSearchParams] = useSearchParams();
const isCreateOpen = searchParams.get("modal") === "create";
const editingId = searchParams.get("edit");

const openCreateModal = () => {
  const newParams = new URLSearchParams(searchParams);
  newParams.set("modal", "create");
  setSearchParams(newParams);
};

const closeModal = () => {
  const newParams = new URLSearchParams(searchParams);
  newParams.delete("modal");
  newParams.delete("edit");
  setSearchParams(newParams);
};

// Bad - useState で状態管理
const [isCreateOpen, setIsCreateOpen] = useState(false);
```

### URL 状態管理のメリット

| メリット | 説明 |
|----------|------|
| ブックマーク可能 | 同じ URL なら同じ画面が表示される |
| 共有可能 | URL を送れば相手も同じ状態を見られる |
| 履歴が正しく動作 | 戻る/進むボタンが期待通りに動く |
| SSR と親和性が高い | サーバーで状態を再現できる |

---

## useState を使う場面（例外）

以下の場合のみ useState を許可する。

```typescript
// OK - 一時的なフォーム入力（送信前の編集中テキスト）
const [draft, setDraft] = useState("");

// OK - アニメーション状態
const [isAnimating, setIsAnimating] = useState(false);

// OK - ホバー・フォーカス状態
const [isHovered, setIsHovered] = useState(false);

// OK - URL に含めると煩雑になる一時的な UI 状態
const [tooltipVisible, setTooltipVisible] = useState(false);
```

---

## Form の使い方

### データ送信は method="post"

```typescript
// Good - form で POST
<Form method="post">
  <input type="hidden" name="intent" value="create" />
  <input type="text" name="title" />
  <button type="submit">Create</button>
</Form>

// Bad - onClick で API コール
<button onClick={() => fetch("/api/create", { method: "POST" })}>
  Create
</button>
```

### 検索・フィルタは method="get"

```typescript
// Good - form で GET（URL パラメータに反映）
<Form method="get">
  <input type="text" name="search" defaultValue={search} />
  <button type="submit">Search</button>
</Form>

// Bad - useState + useEffect で検索
const [search, setSearch] = useState("");
useEffect(() => {
  fetch(`/api/search?q=${search}`);
}, [search]);
```

---

## loader / action パターン

### データ取得は loader

```typescript
// Good - loader でデータ取得
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const items = await getItems(search);
  return { items, search };
}

// Bad - useEffect でデータ取得
useEffect(() => {
  fetch("/api/items").then(res => res.json()).then(setItems);
}, []);
```

### データ更新は action

```typescript
// Good - action でデータ更新
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    await createItem(formData);
  }

  return { success: true };
}
```

---

## Progressive Enhancement

JavaScript が無効でも基本機能が動作するように設計する。

```typescript
// Good - form は JS なしでも動作する
<Form method="post">
  <button type="submit">Submit</button>
</Form>

// Bad - onClick は JS 必須
<button onClick={handleSubmit}>Submit</button>
```

---

## URL パラメータの命名規則

| 用途 | パラメータ名 | 例 |
|------|-------------|-----|
| 検索 | `search`, `q` | `?search=todo` |
| モーダル | `modal` | `?modal=create` |
| 編集対象 | `edit` | `?edit=abc123` |
| ページネーション | `page`, `limit` | `?page=2&limit=20` |
| ソート | `sort`, `order` | `?sort=createdAt&order=desc` |
| フィルタ | `filter`, `status` | `?status=completed` |

---

## 判断フローチャート

```
状態管理が必要
    │
    ├─ URL に含めるべき状態？
    │   │
    │   ├─ ブックマーク/共有したい？
    │   │   └─ YES → searchParams
    │   │
    │   ├─ 戻るボタンで戻したい？
    │   │   └─ YES → searchParams
    │   │
    │   └─ サーバーで再現したい？
    │       └─ YES → searchParams
    │
    └─ 一時的な UI 状態？
        │
        ├─ アニメーション/ホバー/フォーカス？
        │   └─ YES → useState
        │
        ├─ フォーム入力中のドラフト？
        │   └─ YES → useState
        │
        └─ それ以外 → searchParams を優先
```

---

## 禁止事項

- モーダル/ダイアログの開閉に useState を使用しない
- useEffect でデータフェッチしない（loader を使う）
- onClick で API コールしない（Form + action を使う）
- `import * as React from "react"` を useState のためだけに追加しない

---

## React インポートについて

useState を使用しない場合、React のインポートは不要。

```typescript
// Good - useState 不要なら React インポートも不要
import { Form, useSearchParams } from "react-router";

// Bad - useState のためだけに React をインポート
import * as React from "react";
import { Form, useSearchParams } from "react-router";
```
