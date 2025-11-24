# 💰 SalaryLens

給与明細を管理・可視化するWebアプリケーション

## 🚀 機能

- 給与明細PDFのアップロード
- 給与データの可視化・分析
- 支給額・控除額の推移グラフ
- 年収・手取りの計算

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 16, React 19, TailwindCSS 4
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL 16
- **ORM**: Prisma 7
- **インフラ**: Docker, Docker Compose, nginx
- **CI/CD**: GitHub Actions

## 📋 必要要件

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16（Dockerで起動）

## 🏃 開発環境のセットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/your-username/SalaryLens.git
cd SalaryLens
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

```bash
cp .env.example .env
```

### 4. Dockerでデータベースを起動

```bash
npm run docker:up
```

### 5. データベースマイグレーション

```bash
npm run db:push
```

### 6. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 🐳 Dockerで全て起動する場合

開発環境全体（PostgreSQL + Next.js + nginx）をDockerで起動：

```bash
npm run docker:build
npm run docker:up
```

- http://localhost - nginx経由
- http://localhost:3000 - Next.js直接

停止：

```bash
npm run docker:down
```

## 📦 本番デプロイ

### 自動デプロイ（GitHub Actions）

`main`ブランチにpushすると自動的にミニPCにデプロイされます。

詳細は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### 手動デプロイ（ミニPCで実行）

```bash
# ミニPCにSSH接続
ssh user@mini-pc

# プロジェクトディレクトリへ移動
cd ~/SalaryLens

# デプロイスクリプトを実行
npm run deploy
```

## 🔄 ロールバック

デプロイに失敗した場合、前のバージョンに戻せます：

```bash
npm run rollback
```

## 📊 データベース管理

```bash
# Prisma Studio（GUI）を起動
npm run db:studio

# マイグレーションを作成
npm run db:migrate

# スキーマをプッシュ（開発環境）
npm run db:push

# Prisma Clientを再生成
npm run db:generate
```

## 🧪 コマンド一覧

### 開発

```bash
npm run dev          # 開発サーバーを起動
npm run build        # 本番用ビルド
npm run start        # 本番サーバーを起動
npm run lint         # ESLintを実行
npm run format       # Prettierでコード整形
```

### データベース

```bash
npm run db:push      # スキーマをデータベースにプッシュ
npm run db:migrate   # マイグレーションを作成・実行
npm run db:generate  # Prisma Clientを生成
npm run db:studio    # Prisma Studioを起動
```

### Docker（開発環境）

```bash
npm run docker:up    # コンテナを起動
npm run docker:down  # コンテナを停止
npm run docker:logs  # ログを表示
npm run docker:build # イメージをビルド
```

### Docker（本番環境）

```bash
npm run docker:prod:up     # 本番コンテナを起動
npm run docker:prod:down   # 本番コンテナを停止
npm run docker:prod:build  # 本番イメージをビルド
```

### デプロイ

```bash
npm run deploy       # ミニPCにデプロイ（手動）
npm run rollback     # 前のバージョンに戻す
```

## 📁 プロジェクト構成

```
SalaryLens/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions設定
├── app/                        # Next.js App Router
├── nginx/
│   └── nginx.conf              # nginx設定
├── prisma/
│   └── schema.prisma           # データベーススキーマ
├── scripts/
│   ├── deploy.sh               # デプロイスクリプト
│   └── rollback.sh             # ロールバックスクリプト
├── docker-compose.yml          # 開発環境Docker設定
├── docker-compose.prod.yml     # 本番環境Docker設定
├── Dockerfile                  # Next.jsイメージ
├── DEPLOYMENT.md               # デプロイ詳細ガイド
└── deployment-guide.html       # デプロイ構成図（HTML）
```

## 🔐 セキュリティ

- `.env`ファイルは絶対にコミットしない
- 本番環境では強力なパスワードを使用
- GitHub Secretsで機密情報を管理
- HTTPS/SSLを有効化（Let's Encrypt推奨）

## 📚 ドキュメント

- [デプロイガイド](./DEPLOYMENT.md) - 自動デプロイの設定方法
- [構成図](./deployment-guide.html) - システム構成の視覚的説明

## 📝 ライセンス

MIT License
