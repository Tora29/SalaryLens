---
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion, Bash(npm install:*), Bash(npx vitest:*)
description: "Vitest のベストプラクティスに基づいたテストファイルを作成します"
---

以下の手順で Vitest テストファイルを作成します。

## テストファイル命名規則

- **単体テスト**: `[module].test.ts` または `[module].spec.ts`
- **コンポーネントテスト**: `[Component].test.tsx`
- **統合テスト**: `[feature].integration.test.ts`

## テストファイル配置ルール

テストはコロケーション方式で、テスト対象ファイルと同じディレクトリの `__tests__/` フォルダに配置する。

### ルート固有のコード

```
app/routes/dashboard/
├── __tests__/
│   ├── server.test.ts       # server.ts のテスト
│   ├── service.test.ts      # service.ts のテスト
│   └── components/
│       └── SummaryCard.test.tsx
├── server.ts
├── service.ts
└── components/
    └── SummaryCard.tsx
```

### 共有モジュール

**重要**: 共有モジュール（`app/shared/`）のテストは、そのモジュールのディレクトリ内に配置する。ルートの `__tests__/` に配置しない。

```
app/shared/
├── utils/
│   ├── __tests__/
│   │   └── format.test.ts   # format.ts のテスト
│   └── format.ts
├── lib/
│   ├── __tests__/
│   │   └── db.server.test.ts
│   └── db.server.ts
└── components/
    ├── __tests__/
    │   └── Button.test.tsx
    └── Button.tsx
```

**理由**:

- テスト対象との関連性が明確になる
- 共有モジュールの変更時に影響範囲を把握しやすい
- ルート固有のテストと混同しない

## テストファイルテンプレート

### 基本的なユニットテスト

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
// テスト対象をインポート（__tests__/ から親ディレクトリを参照）
import { targetFunction } from "../target";

describe("targetFunction", () => {
  // セットアップとクリーンアップ
  beforeEach(() => {
    // 各テスト前の準備
  });

  afterEach(() => {
    // 各テスト後のクリーンアップ
  });

  it("should return expected result", () => {
    // Arrange（準備）
    const input = "test";

    // Act（実行）
    const result = targetFunction(input);

    // Assert（検証）
    expect(result).toBe("expected");
  });

  it("should handle edge case: null input", () => {
    expect(() => targetFunction(null)).toThrow();
  });

  it("should handle edge case: empty string", () => {
    expect(targetFunction("")).toBe("");
  });
});
```

### モックを使用したテスト

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { serviceFunction } from "../service";

// モジュール全体をモック（vi.mockはファイル先頭に巻き上げられる）
vi.mock("../dependency", () => ({
  dependencyFunction: vi.fn(),
}));

// モックをインポート（vi.mockの後にインポート）
import { dependencyFunction } from "../dependency";

describe("serviceFunction", () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks();
  });

  it("should call dependency with correct args", async () => {
    // モックの戻り値を設定
    vi.mocked(dependencyFunction).mockResolvedValue({ data: "mocked" });

    const result = await serviceFunction("input");

    // モックが正しく呼ばれたか検証
    expect(dependencyFunction).toHaveBeenCalledWith("input");
    expect(dependencyFunction).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: "mocked" });
  });
});
```

### 環境変数のモック

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("環境変数を使用する関数", () => {
  beforeEach(() => {
    // vi.stubEnvを使用（process.envを直接変更しない）
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("API_URL", "https://test.example.com");
  });

  afterEach(() => {
    // 環境変数のスタブを解除
    vi.unstubAllEnvs();
  });

  it("should use mocked env", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });
});
```

### 日時のモック

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("日時に依存する関数", () => {
  beforeEach(() => {
    // 時間を固定
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    // 実際の時間に戻す
    vi.useRealTimers();
  });

  it("should return fixed date", () => {
    expect(new Date().toISOString()).toBe("2025-01-01T00:00:00.000Z");
  });
});
```

### React コンポーネントテスト（React Testing Library）

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../components/Button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### React Router v7 ルートコンポーネントテスト

React Router v7 の自動生成型（`Route.ComponentProps`, `Route.ErrorBoundaryProps`）では、`loaderData` だけでなく `params` と `matches` も必須プロパティとなる。テストではヘルパー関数を作成してこれらをモックする。

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard, { ErrorBoundary } from "../route";
import type { Route } from "../+types/route";

// テスト用のヘルパー：loaderData のみを受け取り、必須の params と matches をモックする
function createMockComponentProps(
  loaderData: Route.ComponentProps["loaderData"]
): Route.ComponentProps {
  return {
    loaderData,
    params: {},
    matches: [] as unknown as Route.ComponentProps["matches"],
  };
}

// ErrorBoundary 用のヘルパー
function createMockErrorBoundaryProps(
  error: unknown
): Route.ErrorBoundaryProps {
  return {
    error,
    params: {},
  };
}

describe("Dashboard", () => {
  it("should render header", () => {
    const mockLoaderData = {
      summary: { /* ... */ },
      monthlySalaries: [],
      recentRecords: [],
    };

    render(<Dashboard {...createMockComponentProps(mockLoaderData)} />);

    expect(screen.getByText("ダッシュボード")).toBeInTheDocument();
  });
});

describe("ErrorBoundary", () => {
  it("should display error message", () => {
    const error = new Error("Something went wrong");

    render(<ErrorBoundary {...createMockErrorBoundaryProps(error)} />);

    expect(screen.getByText("エラー")).toBeInTheDocument();
  });
});
```

## ベストプラクティス

### 1. テスト構造

- `describe` ブロックでテストをグループ化
- `it`/`test` で個別のテストケースを記述
- AAA パターン（Arrange-Act-Assert）に従う

### 2. モックの扱い

- **重要**: 各テスト間でモック状態をクリア（`mockReset: true` または `vi.clearAllMocks()`）
- `vi.mock()` はファイル先頭に自動巻き上げされる
- `vi.mocked()` で TypeScript の型推論を活用
- `vi.stubEnv()` で環境変数をモック（`process.env` を直接変更しない）

### 3. エッジケースのテスト

- null/undefined の入力
- 空文字列、空配列
- 境界値（最小値、最大値）
- エラーケース

### 4. 非推奨パターン

- 実装の詳細に依存したテスト（脆いテスト）
- テスト間の依存関係
- ハードコードされたタイムアウト

### 5. console.error の抑制

テストで意図的にエラーを発生させる場合、`console.error` の出力を抑制して stderr を汚さない。

```typescript
it("異常系: バリデーション失敗時はエラーをスローする", async () => {
  // console.error の出力を抑制（テスト対象の意図的なエラー）
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  // Act & Assert
  await expect(functionThatLogs()).rejects.toBeDefined();

  // 実際にエラーログが呼ばれたことを確認
  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});
```

### 6. コンポーネントテスト

- 実装詳細ではなく、ユーザー行動をテスト
- `getByRole`, `getByText` など意味のあるセレクタを使用
- `data-testid` は最後の手段として

## 実行指示

1. **テスト対象を質問**
   - AskUserQuestion ツールで「テスト対象を入力してください」と質問
   - 選択肢:
     - 「単一ファイル」: ファイルパスを指定（例: app/routes/dashboard/service.ts）
     - 「ディレクトリ全体」: ディレクトリパスを指定（例: app/routes/payslips/(index)）
   - ユーザーから回答を得てから、以降の手順に進んでください。

2. **テスト対象ファイルの特定**

   ### 単一ファイル指定の場合
   - 指定されたファイルをテスト対象とする

   ### ディレクトリ指定の場合: 未テストファイルを検出
   - Glob で対象ディレクトリ内の全ファイルを取得（`**/*.ts`, `**/*.tsx`）
   - `__tests__/` ディレクトリ内のテストファイルを取得
   - テスト対象ファイルとテストファイルを照合し、テストがないファイルをリストアップ
   - 照合ルール:
     - `server.ts` → `__tests__/server.test.ts`
     - `service.ts` → `__tests__/service.test.ts`
     - `components/Foo.tsx` → `__tests__/components/Foo.test.tsx`
   - 未テストファイルの一覧をユーザーに提示し、テスト生成対象を確認

3. **テストファイルの配置を決定**
   - コロケーション方式: テスト対象ディレクトリ内の `__tests__/` フォルダに配置
   - 例: `app/routes/dashboard/service.ts` → `app/routes/dashboard/__tests__/service.test.ts`

4. **テスト対象のコードを読み取る**
   - 関数のシグネチャ、入出力、依存関係を把握

5. **テストケースを設計**
   - 正常系、異常系、エッジケースを網羅
   - モックが必要な外部依存を特定

6. **テストファイルを作成**
   - 上記テンプレートに従って記述
   - コメントは日本語で記述
   - 複数ファイルの場合は順次作成

7. **テストを実行して確認**
   ```bash
   npx vitest run [テストファイルパス]
   ```

## 参考リンク

- [Vitest 公式ドキュメント](https://vitest.dev/guide/)
- [Vitest モック機能](https://vitest.dev/guide/mocking)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
