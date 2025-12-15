# import 整理ルール

## 基本方針

1. **import はカテゴリごとにグループ化し、コメントで区切る**
2. **グループ間は空行で区切る**
3. **各グループ内はアルファベット順を推奨**

---

## グループ順序

以下の順序でグループ化する：

1. **React・外部ライブラリ** - React、React Router、lucide など
2. **型定義** - `type` imports
3. **サーバー・ロジック** - server.ts、service.ts など
4. **共有コンポーネント** - `~/shared/` からの import
5. **ローカルコンポーネント** - `./components/` からの import

---

## コード例

### Good

```tsx
// React・ライブラリ
import { useState } from "react";
import { useSearchParams } from "react-router";
import { FileText } from "lucide-react";

// 型定義
import type { Route } from "./+types/route";
import type { SalaryRecord } from "./schema";

// サーバー・ロジック
import { getLoaderData } from "./server";

// 共有コンポーネント
import { EmptyState } from "~/shared/components/EmptyState";
import { PageLayout } from "~/shared/components/PageLayout";
import { RouteErrorBoundary } from "~/shared/components/RouteErrorBoundary";

// ローカルコンポーネント
import { ExportModal } from "./components/ExportModal";
import { PageHeader } from "./components/PageHeader";
import { PayslipDetailModal } from "./components/PayslipDetailModal";
import { PayslipsTable } from "./components/PayslipsTable";
```

### Bad

```tsx
// コメントなし、グループ化されていない
import { useState } from "react";
import { PageLayout } from "~/shared/components/PageLayout";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/route";
import { FileText } from "lucide-react";
import { getLoaderData } from "./server";
import { PageHeader } from "./components/PageHeader";
import type { SalaryRecord } from "./schema";
```

---

## グループが少ない場合

すべてのカテゴリが存在するとは限らない。存在するカテゴリのみコメントを付ける。

```tsx
// React・ライブラリ
import { Link } from "react-router";

// 型定義
import type { Route } from "./+types/route";

// ローカルコンポーネント
import { SettingsForm } from "./components/SettingsForm";
```

---

## 注意事項

- **コメントは日本語で記述する**（コメントルールに準拠）
- グループ内が1行のみでもコメントは付ける（一貫性のため）
- `type` import は通常の import と分けて「型定義」グループにまとめる
