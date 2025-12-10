# アイコン使用ルール

## 基本方針

1. **アイコンには原則テキストラベルを併用する**
2. **ホバーでラベル表示に頼らない**（タッチデバイス非対応）
3. **普遍的なアイコンは少ない**という前提で設計する
4. lucide アイコンを使用しsvg は**原則使用禁止**とする。

---

## 使用ライブラリ

- **lucide-react** を使用する

```typescript
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
```

---

## パターン別ガイドライン

### 1. 主要アクション（CTA）

アイコン + テキストラベルを必ず併用する。

```tsx
// Good - アイコン + テキスト
<button className="flex items-center gap-2">
  <Plus size={20} />
  New TODO
</button>

// Bad - アイコンのみ
<button>
  <Plus size={20} />
</button>
```

### 2. 繰り返しアクション（リスト内の Edit / Delete）

以下のいずれかを選択：

```tsx
// Option A: テキストのみ（シンプル、確実）
<button>Edit</button>
<button>Delete</button>

// Option B: アイコン + テキスト（視認性向上）
<button className="flex items-center gap-1">
  <Pencil size={16} />
  Edit
</button>

// Option C: アイコンのみ + aria-label（省スペース、慣れたユーザー向け）
<button aria-label="Edit">
  <Pencil size={16} />
</button>
```

**判断基準：**
- リスト項目が多い → Option C（省スペース）
- 初心者ユーザーが多い → Option A or B（明確性重視）

### 3. 検索・フィルタ

検索アイコンは比較的普遍的だが、ラベルがあると安全。

```tsx
// Good - 検索フィールド内にアイコン
<div className="grid grid-cols-[auto_1fr] items-center gap-2">
  <Search size={20} />
  <input type="text" placeholder="Search..." />
</div>

// Good - ボタンにアイコン + テキスト
<button className="flex items-center gap-2">
  <Search size={16} />
  Search
</button>
```

### 4. 閉じる・キャンセル

X アイコンは比較的普遍的。モーダルの閉じるボタンなど。

```tsx
// OK - X アイコンのみ（モーダル右上など、文脈が明確な場合）
<button aria-label="Close">
  <X size={20} />
</button>

// Better - テキストボタン（フォーム内のキャンセル）
<button>Cancel</button>
```

---

## アイコンサイズの基準

| 用途 | サイズ | 例 |
|------|--------|-----|
| ボタン内（テキスト併用） | `size={20}` | New TODO ボタン |
| 小さいボタン / インライン | `size={16}` | Edit, Delete |
| 大きいアイコン（ヒーロー） | `size={24}` 以上 | 空状態のイラスト |

---

## アクセシビリティ

### aria-label 必須のケース

アイコンのみのボタンには必ず `aria-label` を付ける。

```tsx
// Good
<button aria-label="Delete item">
  <Trash2 size={16} />
</button>

// Bad - スクリーンリーダーで意味不明
<button>
  <Trash2 size={16} />
</button>
```

### 装飾的アイコン

テキストラベルがある場合、アイコンは装飾的なので `aria-hidden` を付ける。

```tsx
// Good - アイコンは装飾、テキストが主
<button className="flex items-center gap-2">
  <Plus size={20} aria-hidden="true" />
  New TODO
</button>
```

---

## 禁止事項

- アイコンのみでラベルも `aria-label` もないボタンを作らない
- ホバー時のみラベルを表示する設計にしない
- 意味が曖昧なアイコンを単独で使用しない（例: 歯車、星、ハート）

---

## 判断フローチャート

```
アイコンを使いたい
    │
    ├─ 主要アクション（CTA）？
    │   └─ YES → アイコン + テキスト（必須）
    │
    ├─ 繰り返しアクション（リスト内）？
    │   │
    │   ├─ スペースに余裕あり？
    │   │   └─ YES → テキストのみ or アイコン + テキスト
    │   │
    │   └─ スペース制約あり？
    │       └─ YES → アイコンのみ + aria-label
    │
    ├─ 検索 / 閉じる（普遍的アイコン）？
    │   └─ YES → アイコンのみ可（aria-label 必須）
    │
    └─ それ以外？
        └─ テキストラベル必須
```

---

## 参考資料

- [Nielsen Norman Group - Icon Usability](https://www.nngroup.com/articles/icon-usability/)
- [Apple Human Interface Guidelines - Icons](https://developer.apple.com/design/human-interface-guidelines/foundations/icons/)
- [Material Design - Icons](https://m3.material.io/styles/icons/overview)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
