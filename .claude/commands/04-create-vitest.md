---
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(npm install:*), Bash(npx vitest:*)
description: "Vitest のベストプラクティスに基づいたテストファイルを作成します"
---

以下の手順で Vitest テストファイルを作成します。

## テストファイル命名規則

- **単体テスト**: `[module].test.ts` または `[module].spec.ts`
- **コンポーネントテスト**: `[Component].test.tsx`
- **統合テスト**: `[feature].integration.test.ts`
- **E2Eテスト**: `[feature].e2e.test.ts`

## テストファイルテンプレート

### 基本的なユニットテスト

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
// テスト対象をインポート（__tests__/ から親ディレクトリを参照）
import { targetFunction } from '../target'

describe('targetFunction', () => {
  // セットアップとクリーンアップ
  beforeEach(() => {
    // 各テスト前の準備
  })

  afterEach(() => {
    // 各テスト後のクリーンアップ
  })

  it('should return expected result', () => {
    // Arrange（準備）
    const input = 'test'

    // Act（実行）
    const result = targetFunction(input)

    // Assert（検証）
    expect(result).toBe('expected')
  })

  it('should handle edge case: null input', () => {
    expect(() => targetFunction(null)).toThrow()
  })

  it('should handle edge case: empty string', () => {
    expect(targetFunction('')).toBe('')
  })
})
```

### モックを使用したテスト

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serviceFunction } from '../service'

// モジュール全体をモック（vi.mockはファイル先頭に巻き上げられる）
vi.mock('../dependency', () => ({
  dependencyFunction: vi.fn(),
}))

// モックをインポート（vi.mockの後にインポート）
import { dependencyFunction } from '../dependency'

describe('serviceFunction', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks()
  })

  it('should call dependency with correct args', async () => {
    // モックの戻り値を設定
    vi.mocked(dependencyFunction).mockResolvedValue({ data: 'mocked' })

    const result = await serviceFunction('input')

    // モックが正しく呼ばれたか検証
    expect(dependencyFunction).toHaveBeenCalledWith('input')
    expect(dependencyFunction).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ data: 'mocked' })
  })
})
```

### 環境変数のモック

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('環境変数を使用する関数', () => {
  beforeEach(() => {
    // vi.stubEnvを使用（process.envを直接変更しない）
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('API_URL', 'https://test.example.com')
  })

  afterEach(() => {
    // 環境変数のスタブを解除
    vi.unstubAllEnvs()
  })

  it('should use mocked env', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })
})
```

### 日時のモック

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('日時に依存する関数', () => {
  beforeEach(() => {
    // 時間を固定
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    // 実際の時間に戻す
    vi.useRealTimers()
  })

  it('should return fixed date', () => {
    expect(new Date().toISOString()).toBe('2025-01-01T00:00:00.000Z')
  })
})
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

### 5. コンポーネントテスト
- 実装詳細ではなく、ユーザー行動をテスト
- `getByRole`, `getByText` など意味のあるセレクタを使用
- `data-testid` は最後の手段として

## 実行指示

1. **テスト対象ファイルを特定**
   - ユーザーから指定されたファイル、または会話の文脈から推測

2. **テストファイルの配置を決定**
   - コロケーション方式: テスト対象ディレクトリ内の `__tests__/` フォルダに配置
   - 例: `app/routes/dashboard/service.ts` → `app/routes/dashboard/__tests__/service.test.ts`

3. **テスト対象のコードを読み取る**
   - 関数のシグネチャ、入出力、依存関係を把握

4. **テストケースを設計**
   - 正常系、異常系、エッジケースを網羅
   - モックが必要な外部依存を特定

5. **テストファイルを作成**
   - 上記テンプレートに従って記述
   - コメントは日本語で記述

6. **テストを実行して確認**
   ```bash
   npx vitest run [テストファイルパス]
   ```

## 参考リンク

- [Vitest 公式ドキュメント](https://vitest.dev/guide/)
- [Vitest モック機能](https://vitest.dev/guide/mocking)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
