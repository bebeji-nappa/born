# Born

## 使用技術

技術的な深掘りも目的としてあるので、実験的な技術選定にしています。

- Framework
  - Next.js 15
- API
  - Hono
  - Cloudflare Workers
  - Prisma Client
- DB
  - Cloudflare D1
  - Prisma
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

# Prisma でマイグレーション実行
pnpm db:migrate

# Prisma Client を生成
pnpm db:generate
```

## 環境変数の設定

### Client (apps/client)

```bash
# GitHub OAuth
AUTH_GITHUB_ID=[Client ID]
AUTH_GITHUB_SECRET=[Client Secret Key]

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[NextAuth で使用する認証シークレット用ハッシュ文字列]

# Basic認証
NEXT_PUBLIC_BASIC_AUTH_USERNAME=[Basic認証用ユーザネーム]
NEXT_PUBLIC_BASIC_AUTH_PASSWORD=[Basic認証用パスワード]

# その他
NEXT_PUBLIC_EMAIL=[GitHub Accountで登録されているメールアドレス]
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### API (apps/api)

`.dev.vars` ファイルに設定します。

```bash
# Cloudflare D1 の DATABASE_URL は wrangler.toml で設定されます
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

# デプロイ（Client）
cd apps/client
pnpm deploy

# デプロイ（API）
cd apps/api
pnpm deploy
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

# Prisma Studio（DB管理）
pnpm db:studio
```

## プロジェクト構成

```
born/
├── apps/
│   ├── client/     # Next.js アプリケーション
│   └── api/        # Cloudflare Workers API (Hono)
├── package.json    # モノレポルート設定
├── pnpm-workspace.yaml
└── turbo.json      # Turborepo 設定
```
