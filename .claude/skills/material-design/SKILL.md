---
name: material-design
description: Google Material Design 3 に基づいた UI デザインガイド。カラーシステム、タイポグラフィ、コンポーネント、スペーシングの実装。UI 作成、コンポーネント設計、デザイントークン定義時に使用。
---

# Material Design 3 スタイルガイド

Tailwind CSS で Material Design 3（M3）の原則に沿った UI を実装するためのガイド。

## このスキルを使用するタイミング

- 新しい UI コンポーネントを作成するとき
- ページレイアウトを設計するとき
- カラーパレットやテーマを定義するとき
- ボタン、カード、入力フィールドなどを実装するとき
- 一貫したデザインシステムを構築するとき

---

## コアコンセプト

### Material Design 3 の特徴

1. **Dynamic Color**: ユーザーの壁紙や設定から派生するカラースキーム
2. **表現力のあるシェイプ**: 丸みを帯びた角
3. **更新されたコンポーネント**: より大きなタッチターゲット、視覚的な階層
4. **アクセシビリティ**: WCAG AA 準拠のコントラスト比

---

## カラーシステム

### 基本カラートークン

```css
/* tailwind.config.js または CSS 変数で定義 */
:root {
  /* Primary - メインのブランドカラー */
  --md-primary: #6750A4;
  --md-on-primary: #FFFFFF;
  --md-primary-container: #EADDFF;
  --md-on-primary-container: #21005D;

  /* Secondary - 補助的なアクセント */
  --md-secondary: #625B71;
  --md-on-secondary: #FFFFFF;
  --md-secondary-container: #E8DEF8;
  --md-on-secondary-container: #1D192B;

  /* Tertiary - 三次的なアクセント */
  --md-tertiary: #7D5260;
  --md-on-tertiary: #FFFFFF;
  --md-tertiary-container: #FFD8E4;
  --md-on-tertiary-container: #31111D;

  /* Error - エラー状態 */
  --md-error: #B3261E;
  --md-on-error: #FFFFFF;
  --md-error-container: #F9DEDC;
  --md-on-error-container: #410E0B;

  /* Surface - 背景・表面 */
  --md-surface: #FEF7FF;
  --md-on-surface: #1D1B20;
  --md-surface-variant: #E7E0EC;
  --md-on-surface-variant: #49454F;

  /* Outline */
  --md-outline: #79747E;
  --md-outline-variant: #CAC4D0;
}
```

### Tailwind 拡張設定例

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--md-primary)',
          container: 'var(--md-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--md-secondary)',
          container: 'var(--md-secondary-container)',
        },
        surface: {
          DEFAULT: 'var(--md-surface)',
          variant: 'var(--md-surface-variant)',
        },
        outline: {
          DEFAULT: 'var(--md-outline)',
          variant: 'var(--md-outline-variant)',
        },
        error: {
          DEFAULT: 'var(--md-error)',
          container: 'var(--md-error-container)',
        },
      },
    },
  },
}
```

### カラー使用ルール

| 用途 | トークン |
|------|----------|
| 主要なアクション（CTA ボタン） | `primary` |
| 主要ボタンのテキスト | `on-primary` |
| カード・モーダルの背景 | `surface` |
| 低優先度のアクション | `secondary` |
| エラーメッセージ | `error` |
| 境界線 | `outline` / `outline-variant` |

---

## タイポグラフィ

### Type Scale

```css
/* M3 Type Scale - Tailwind クラスでの実装 */

/* Display */
.text-display-large { @apply text-[57px] leading-[64px] tracking-[-0.25px]; }
.text-display-medium { @apply text-[45px] leading-[52px] tracking-[0]; }
.text-display-small { @apply text-[36px] leading-[44px] tracking-[0]; }

/* Headline */
.text-headline-large { @apply text-[32px] leading-[40px] tracking-[0]; }
.text-headline-medium { @apply text-[28px] leading-[36px] tracking-[0]; }
.text-headline-small { @apply text-[24px] leading-[32px] tracking-[0]; }

/* Title */
.text-title-large { @apply text-[22px] leading-[28px] tracking-[0]; }
.text-title-medium { @apply text-[16px] leading-[24px] tracking-[0.15px] font-medium; }
.text-title-small { @apply text-[14px] leading-[20px] tracking-[0.1px] font-medium; }

/* Body */
.text-body-large { @apply text-[16px] leading-[24px] tracking-[0.5px]; }
.text-body-medium { @apply text-[14px] leading-[20px] tracking-[0.25px]; }
.text-body-small { @apply text-[12px] leading-[16px] tracking-[0.4px]; }

/* Label */
.text-label-large { @apply text-[14px] leading-[20px] tracking-[0.1px] font-medium; }
.text-label-medium { @apply text-[12px] leading-[16px] tracking-[0.5px] font-medium; }
.text-label-small { @apply text-[11px] leading-[16px] tracking-[0.5px] font-medium; }
```

### Tailwind での近似実装

| M3 スタイル | Tailwind クラス |
|------------|-----------------|
| Display Large | `text-6xl font-normal` |
| Display Medium | `text-5xl font-normal` |
| Headline Large | `text-3xl font-normal` |
| Headline Medium | `text-2xl font-normal` |
| Title Large | `text-xl font-normal` |
| Title Medium | `text-base font-medium` |
| Body Large | `text-base font-normal` |
| Body Medium | `text-sm font-normal` |
| Label Large | `text-sm font-medium` |
| Label Small | `text-xs font-medium` |

---

## シェイプ（角丸）

### Shape Scale

| カテゴリ | 値 | Tailwind | 用途 |
|----------|-----|----------|------|
| None | 0px | `rounded-none` | 画像 |
| Extra Small | 4px | `rounded` | チップ、小さい要素 |
| Small | 8px | `rounded-lg` | テキストフィールド |
| Medium | 12px | `rounded-xl` | カード |
| Large | 16px | `rounded-2xl` | モーダル、シート |
| Extra Large | 28px | `rounded-[28px]` | FAB |
| Full | 50% | `rounded-full` | アイコンボタン |

---

## エレベーション（影）

### Elevation Levels

```css
/* M3 Elevation - Tailwind shadow 拡張 */
.elevation-0 { @apply shadow-none; }
.elevation-1 { @apply shadow-sm; }  /* 1dp */
.elevation-2 { @apply shadow; }      /* 3dp */
.elevation-3 { @apply shadow-md; }   /* 6dp */
.elevation-4 { @apply shadow-lg; }   /* 8dp */
.elevation-5 { @apply shadow-xl; }   /* 12dp */
```

### 用途

| レベル | 用途 |
|--------|------|
| 0 | 通常状態のサーフェス |
| 1 | カード、ホバー状態 |
| 2 | ナビゲーションバー |
| 3 | FAB、スナックバー |
| 4 | モーダル、ダイアログ |
| 5 | ドロワー |

---

## スペーシング

### 4px グリッドシステム

| 値 | Tailwind | 用途 |
|----|----------|------|
| 4px | `p-1`, `m-1`, `gap-1` | 最小間隔 |
| 8px | `p-2`, `m-2`, `gap-2` | コンパクトな要素間 |
| 12px | `p-3`, `m-3`, `gap-3` | 中程度の要素間 |
| 16px | `p-4`, `m-4`, `gap-4` | 標準の要素間 |
| 24px | `p-6`, `m-6`, `gap-6` | セクション間 |
| 32px | `p-8`, `m-8`, `gap-8` | 大きなセクション間 |

---

## コンポーネント実装例

### Filled Button

```html
<button class="
  bg-primary text-white
  px-6 py-2.5
  rounded-full
  text-sm font-medium tracking-wide
  hover:shadow-md
  active:shadow-none
  transition-shadow
  disabled:opacity-38 disabled:shadow-none
">
  Button
</button>
```

### Outlined Button

```html
<button class="
  border border-outline
  text-primary
  px-6 py-2.5
  rounded-full
  text-sm font-medium tracking-wide
  hover:bg-primary/8
  active:bg-primary/12
  transition-colors
">
  Button
</button>
```

### Text Button

```html
<button class="
  text-primary
  px-3 py-2.5
  rounded-full
  text-sm font-medium tracking-wide
  hover:bg-primary/8
  active:bg-primary/12
  transition-colors
">
  Button
</button>
```

### Card

```html
<div class="
  bg-surface
  rounded-xl
  p-4
  shadow-sm
  hover:shadow-md
  transition-shadow
">
  <h3 class="text-title-medium text-on-surface">Card Title</h3>
  <p class="text-body-medium text-on-surface-variant mt-2">
    Card content goes here.
  </p>
</div>
```

### Elevated Card

```html
<div class="
  bg-surface
  rounded-xl
  p-4
  shadow-md
">
  <h3 class="text-lg font-medium">Elevated Card</h3>
  <p class="text-sm text-on-surface-variant mt-2">
    Content with more prominence.
  </p>
</div>
```

### Filled Card

```html
<div class="
  bg-surface-variant
  rounded-xl
  p-4
">
  <h3 class="text-lg font-medium">Filled Card</h3>
  <p class="text-sm text-on-surface-variant mt-2">
    Subtle background distinction.
  </p>
</div>
```

### Text Field（Outlined）

```html
<div class="relative">
  <input
    type="text"
    placeholder=" "
    class="
      peer
      w-full
      border border-outline
      rounded-lg
      px-4 py-4
      text-base
      focus:border-primary focus:border-2
      focus:outline-none
      transition-colors
    "
  />
  <label class="
    absolute left-3 top-4
    text-on-surface-variant
    bg-surface
    px-1
    transition-all
    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary
    peer-[:not(:placeholder-shown)]:-top-2.5
    peer-[:not(:placeholder-shown)]:text-xs
  ">
    Label
  </label>
</div>
```

### Chip（Filter）

```html
<button class="
  flex items-center gap-2
  px-4 py-1.5
  rounded-lg
  border border-outline
  text-sm
  hover:bg-on-surface/8
  aria-selected:bg-secondary-container
  aria-selected:border-transparent
">
  <span>Filter</span>
</button>
```

### FAB（Floating Action Button）

```html
<button class="
  bg-primary-container
  text-on-primary-container
  p-4
  rounded-2xl
  shadow-lg
  hover:shadow-xl
  active:shadow-md
  transition-shadow
">
  <PlusIcon class="w-6 h-6" />
</button>
```

### Navigation Bar Item

```html
<a class="
  flex flex-col items-center gap-1
  px-4 py-3
  rounded-2xl
  hover:bg-on-surface/8
  aria-selected:bg-secondary-container
">
  <HomeIcon class="w-6 h-6" />
  <span class="text-xs font-medium">Home</span>
</a>
```

### Snackbar

```html
<div class="
  fixed bottom-4 left-1/2 -translate-x-1/2
  bg-inverse-surface
  text-inverse-on-surface
  px-4 py-3
  rounded-lg
  shadow-lg
  flex items-center gap-4
">
  <span class="text-sm">Message sent</span>
  <button class="text-inverse-primary text-sm font-medium">
    Undo
  </button>
</div>
```

### Dialog

```html
<div class="
  fixed inset-0 flex items-center justify-center
  bg-black/50
">
  <div class="
    bg-surface
    rounded-[28px]
    p-6
    w-full max-w-md
    shadow-xl
  ">
    <h2 class="text-2xl">Dialog Title</h2>
    <p class="text-sm text-on-surface-variant mt-4">
      Dialog content and supporting text.
    </p>
    <div class="flex justify-end gap-2 mt-6">
      <button class="text-primary px-3 py-2 rounded-full text-sm font-medium">
        Cancel
      </button>
      <button class="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## 状態レイヤー（State Layer）

### ホバー・フォーカス・プレス状態

```css
/* 状態レイヤーの不透明度 */
.state-hover { @apply bg-current/8; }   /* 8% */
.state-focus { @apply bg-current/12; }  /* 12% */
.state-press { @apply bg-current/12; }  /* 12% */
.state-drag { @apply bg-current/16; }   /* 16% */
```

### 実装パターン

```html
<!-- ボタンの状態 -->
<button class="
  relative
  bg-primary text-white
  px-6 py-2.5 rounded-full
  hover:before:absolute hover:before:inset-0
  hover:before:bg-white/8 hover:before:rounded-full
  active:before:bg-white/12
">
  Button
</button>

<!-- 簡易版（背景色変更） -->
<button class="
  bg-primary text-white
  px-6 py-2.5 rounded-full
  hover:bg-primary/90
  active:bg-primary/80
">
  Button
</button>
```

---

## アクセシビリティ

### コントラスト比要件

| 要素 | 最小コントラスト比 |
|------|-------------------|
| 通常テキスト | 4.5:1 |
| 大きいテキスト（18px+） | 3:1 |
| UI コンポーネント | 3:1 |

### タッチターゲット

- 最小タッチターゲット: **48x48dp**
- Tailwind: `min-w-12 min-h-12`

### フォーカスインジケーター

```html
<button class="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary
  focus-visible:ring-offset-2
">
  Button
</button>
```

---

## ダークテーマ

### ダークモード変数

```css
@media (prefers-color-scheme: dark) {
  :root {
    --md-primary: #D0BCFF;
    --md-on-primary: #381E72;
    --md-primary-container: #4F378B;
    --md-on-primary-container: #EADDFF;

    --md-surface: #141218;
    --md-on-surface: #E6E0E9;
    --md-surface-variant: #49454F;
    --md-on-surface-variant: #CAC4D0;

    --md-outline: #938F99;
    --md-outline-variant: #49454F;
  }
}
```

### Tailwind dark: プレフィックス

```html
<div class="
  bg-surface dark:bg-surface-dark
  text-on-surface dark:text-on-surface-dark
">
  Content
</div>
```

---

## AI アシスタント指示

このスキルが呼び出されたとき：

1. **常に行うこと**
   - M3 のカラートークンを使用する
   - 4px グリッドに基づいたスペーシング
   - 適切な角丸（コンポーネントに応じた shape scale）
   - アクセシビリティ要件の遵守（コントラスト比、タッチターゲット）

2. **決して行わないこと**
   - 任意のマジックナンバーを使用する
   - M3 の shape scale から外れた角丸
   - 最小タッチターゲット（48dp）未満のインタラクティブ要素
   - コントラスト比 3:1 未満の UI 要素

3. **ワークフロー**
   - まず要素の種類を特定する（ボタン、カード、入力など）
   - 対応する M3 コンポーネント仕様を参照する
   - Tailwind クラスで実装する
   - 状態（hover、focus、active）を追加する
   - アクセシビリティをチェックする

---

## 参考リンク

- [Material Design 3](https://m3.material.io/)
- [M3 Color System](https://m3.material.io/styles/color/overview)
- [M3 Typography](https://m3.material.io/styles/typography/overview)
- [M3 Components](https://m3.material.io/components)
