# レイヤー依存関係ルール

## 基本方針

各ファイルの責務を明確に分離し、依存関係を単方向に保つ。

---

## 依存関係の流れ

```
route.tsx → server.ts → service.ts → schema.ts
    ↓           ↓            ↓
  UI層      loader/action  ビジネスロジック
```

---

## 各レイヤーの責務

| ファイル     | 責務                           | インポート可能                            |
| ------------ | ------------------------------ | ----------------------------------------- |
| `route.tsx`  | UI 描画、loader/action の公開  | `server.ts`, `schema.ts`（型のみ）        |
| `server.ts`  | DB アクセス、外部 API 呼び出し | `service.ts`, `schema.ts`, 共有ライブラリ |
| `service.ts` | ビジネスロジック（純粋関数）   | `schema.ts` のみ                          |
| `schema.ts`  | zod スキーマ、型定義           | 外部ライブラリのみ（zod 等）              |

---

## 許可されるインポート

### route.tsx

```typescript
// OK
import { getLoaderData, handleAction } from "./server";
import type { LoaderData } from "./schema";

// NG - service.ts を直接インポートしない
import { calculateSummary } from "./service";
```

### server.ts

```typescript
// OK
import { prisma } from "~/shared/lib/db.server";
import { calculateSummary } from "./service";
import type { LoaderData } from "./schema";
import { entitySchema } from "./schema";

// NG - route.tsx をインポートしない（循環参照）
import { loader } from "./route";
```

### service.ts

```typescript
// OK
import type { Entity, SummaryData } from "./schema";

// NG - DB や外部 API に依存しない
import { prisma } from "~/shared/lib/db.server";
import { fetchData } from "./server";
```

---

## 共有ユーティリティの扱い

`~/shared/` 配下のユーティリティは、どのレイヤーからもインポート可能。

```typescript
// 全レイヤーで OK
import { formatCurrency } from "~/shared/utils/format";
```

---

## 禁止事項

- `route.tsx` から `service.ts` を直接インポートしない
- `service.ts` から DB や外部 API に依存しない
- 循環参照を作らない
- 再エクスポート（re-export）を使わない

---

## 再エクスポートを避ける理由

再エクスポートは実体の所在を分かりにくくし、可読性を下げる。

```typescript
// NG - 再エクスポート（実体がどこにあるか不明確）
// Sidebar.tsx
export { MobileHeader } from "./components";

// 使用側
import { MobileHeader } from "./Sidebar"; // 実体は components/ にある

// OK - 実体の場所から直接インポート
import { MobileHeader } from "./components";
import { Sidebar } from "./Sidebar";
```

---

## 判断フローチャート

```
新しい関数を追加したい
    │
    ├─ DB や外部 API にアクセスする？
    │   └─ YES → server.ts に追加
    │
    ├─ 純粋な計算・変換ロジック？
    │   └─ YES → service.ts に追加
    │
    ├─ 型やスキーマの定義？
    │   └─ YES → schema.ts に追加
    │
    └─ UI に関係する？
        └─ YES → route.tsx に追加
```
