# Born

## 使用技術

- 技術的な深掘りも目的としてあるので、実験的な技術選定にしています
- **また、今回はAI駆動開発の知見を増やす目的で、コーディングをほぼ全て Claude Code に任せております。時々自分で書く場合もありますが、大半がAIが書いています**
- 現在はリリースに向けて、初速をスピード感高めで開発する方針で進めており、リアーキテクチャやフォーマッターの整備が追いついていません。そのため、タイミングによっては、きれいなコードではない場合がありますのでご了承ください

- Framework
  - Next.js 15 (App Router)
- API
  - Hono
  - Cloudflare Workers
- ORM
  - Drizzle ORM
- DB
  - Cloudflare D1 (SQLite)
- Storage
  - Cloudflare R2
- Deployment
  - Cloudflare Pages (Client)
  - Cloudflare Workers (API)

## 事前準備

1. 依存関係のインストール

```bash
pnpm install
```

2. Cloudflare D1 データベースのセットアップ

```bash
# API ディレクトリに移動
cd apps/api

# Drizzle でマイグレーション生成
pnpm db:generate

# ローカルDBにマイグレーション適用
pnpm wrangler d1 migrations apply born-db-local --local --env=development
```

## 環境変数の設定

### Client (apps/client)

`.env.local` ファイルに設定します。

```bash
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# その他
NEXT_PUBLIC_EMAIL=[GitHub Accountで登録されているメールアドレス]
```

### API (apps/api)

`.dev.vars` ファイルに設定します。

```bash
# GitHub OAuth
AUTH_GITHUB_ID=[Client ID]
AUTH_GITHUB_SECRET=[Client Secret Key]

# Authentication
ALLOW_EMAIL=[許可するメールアドレス]

# API Configuration
API_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Storage
STORAGE_URL=https://storage-dev.bebeji-nappa.com

# Environment
NODE_ENV=development
```

## 開発サーバーの起動

モノレポ全体を起動（推奨）:

```bash
pnpm dev
```

個別に起動する場合:

```bash
# Client (Next.js)
cd apps/client
pnpm dev

# API (Cloudflare Workers)
cd apps/api
pnpm dev
```

http://localhost:3000 にアクセスして動作を確認してください。

### 使用権限について

環境変数 `NEXT_PUBLIC_EMAIL` に設定したメールアドレスで登録された GitHub アカウントのみ、すべての機能を使用できます。それ以外のアカウントはブログ記事の閲覧のみ可能です。

## ビルド・デプロイ

```bash
# ビルド
pnpm build

# デプロイ（Staging）
cd apps/api
pnpm deploy:staging

cd apps/client
pnpm deploy:staging

# デプロイ（Production）
cd apps/api
pnpm deploy:production

cd apps/client
pnpm deploy:production
```

### マイグレーション（本番環境）

```bash
cd apps/api

# Staging環境
pnpm wrangler d1 migrations apply born-db-staging --env=staging

# Production環境
pnpm wrangler d1 migrations apply born-db --env=production
```

## テスト

### Client (apps/client)

```bash
cd apps/client

# Lint チェック
pnpm lint

# Lint 自動修正
pnpm fix:lint

# 単体テスト
pnpm test

# E2E テスト
pnpm e2e

# Storybook
pnpm storybook
```

### API (apps/api)

```bash
cd apps/api

# 開発サーバー起動
pnpm dev

# Drizzle Studio（DB管理）
pnpm db:studio

# マイグレーション生成
pnpm db:generate
```

## プロジェクト構成

```
born/
├── apps/
│   ├── client/     # Next.js アプリケーション
│   └── api/        # Cloudflare Workers API (Hono)
│       ├── src/
│       │   ├── db/
│       │   │   ├── schema.ts      # Drizzle ORM スキーマ定義
│       │   │   └── index.ts       # DB接続設定
│       │   ├── routes/            # API ルート
│       │   ├── services/          # ビジネスロジック
│       │   └── middleware/        # 認証ミドルウェア等
│       ├── db/
│       │   └── migrations/        # マイグレーションファイル
│       ├── wrangler.toml          # Cloudflare Workers設定
│       └── drizzle.config.ts      # Drizzle設定
├── package.json    # モノレポルート設定
├── pnpm-workspace.yaml
└── turbo.json      # Turborepo 設定
```

## 環境ごとの構成

### Development (ローカル)
- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- DB: Wrangler ローカルエミュレーター
- Storage: Wrangler ローカルR2エミュレーター（APIサーバー経由で配信）
