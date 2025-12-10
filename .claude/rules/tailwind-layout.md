# Tailwind レイアウトルール

## 基本方針

1. **grid をデフォルトとし、flex は限定的に使用する**
2. **必要なカラム数を直接指定する**（12 grid は使用しない）

---

## Grid の使い方

### ページレイアウト（大枠）

必要なカラム数を直接指定し、col-span で分割する。

```html
<!-- サイドバー + メイン（1:3） -->
<div class="grid grid-cols-4 gap-6">
  <aside>Sidebar</aside>
  <main class="col-span-3">Content</main>
</div>

<!-- 3カラムレイアウト（1:2:1） -->
<div class="grid grid-cols-4 gap-6">
  <nav>Nav</nav>
  <main class="col-span-2">Content</main>
  <aside>Aside</aside>
</div>

<!-- 2カラム均等 -->
<div class="grid grid-cols-2 gap-6">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- レスポンシブ対応 -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
  <aside>Sidebar</aside>
  <main class="md:col-span-3">Content</main>
</div>
```

### コンポーネント内部

シンプルな grid を使用。

```html
<!-- 縦方向の積み重ね -->
<div class="grid gap-4">
  <h2>Title</h2>
  <p>Description</p>
  <button>Action</button>
</div>

<!-- カード一覧（3列） -->
<ul class="grid grid-cols-3 gap-4">
  <li>Card 1</li>
  <li>Card 2</li>
  <li>Card 3</li>
</ul>

<!-- フォーム -->
<form class="grid gap-4">
  <input type="text" />
  <input type="email" />
  <button type="submit">Submit</button>
</form>

<!-- ラベル + インプット（横並び） -->
<div class="grid grid-cols-[auto_1fr] gap-4 items-center">
  <label>Name</label>
  <input type="text" />
</div>
```

---

## Flex の使い方（限定的）

以下のパターンでのみ flex を使用する。

### 1. インライン要素の横並び（アイコン + テキスト等）

```html
<button class="flex items-center gap-2">
  <Icon /> Submit
</button>

<span class="flex items-center gap-1">
  <StarIcon /> 4.5
</span>
```

### 2. 中央寄せ（単一要素）

```html
<div class="flex items-center justify-center h-screen">
  <Spinner />
</div>
```

### 3. 両端配置（justify-between）

```html
<nav class="flex items-center justify-between">
  <Logo />
  <div class="flex items-center gap-6">
    <a>Menu1</a>
    <a>Menu2</a>
  </div>
</nav>
```

### 4. 折り返しが必要なリスト（タグ、バッジ等）

```html
<div class="flex flex-wrap gap-2">
  <span class="badge">React</span>
  <span class="badge">TypeScript</span>
  <span class="badge">Prisma</span>
</div>
```

---

## Gap の基準（8px 単位）

| クラス | 用途 |
|--------|------|
| `gap-1` (4px) | 極小（アイコンとテキストの間など） |
| `gap-2` (8px) | インライン要素間（ボタン内、タグ間） |
| `gap-4` (16px) | コンポーネント内要素間（フォーム項目など） |
| `gap-6` (24px) | セクション間、ページレイアウト |

---

## 判断フローチャート

```
レイアウトが必要
    │
    ├─ インライン要素の横並び？（アイコン+テキスト）
    │   └─ YES → flex items-center gap-*
    │
    ├─ 単一要素の中央寄せ？
    │   └─ YES → flex items-center justify-center
    │
    ├─ 両端配置が必要？（ロゴとメニュー等）
    │   └─ YES → flex items-center justify-between
    │
    ├─ 折り返しが必要なリスト？（タグ、バッジ等）
    │   └─ YES → flex flex-wrap gap-*
    │
    └─ それ以外 → grid
```

---

## 禁止事項

- `flex-col` は使用しない（`grid` で代替）
- `flex` の中に `flex` をネストしない（`grid > flex` は許可）

---

## 判断に迷う場合

以下のケースなど、このルールでカバーしきれない場合は都度ユーザーに確認する：

- 「インライン要素」の境界が不明確な場合（ボタン2つの横並び等）
- `gap-6` を超えるスペースが必要な場合
- 3層以上のネスト（`grid > flex > grid` 等）
- 中央寄せで `flex` と `grid place-items-center` のどちらを使うか
- レスポンシブで flex の横並びを縦にしたい場合
