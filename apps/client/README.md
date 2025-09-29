# Born

## 使用技術

技術的な深掘りも目的としてあるので、実験的な技術選定にしています。

- Framework
  - Next.js
- API
  - API Routes
  - tRPC
  - Prisma Client
- DB
  - PostgreSQL
  - Prisma

## 事前準備

1. 以下コマンドで .env を作成します

```
$ cp .env.sample .env
```

2. [Homebrew 公式サイト](https://brew.sh/ja/)から、Homebrew をインストールします。

3. pnpm install を実行します

```
$ pnpm install
```

4. DB を設定します。
homebrew で postgresql をインストールします。

```
$ brew install postgresql
```

PostgreSQL を起動して、以下の SQL で born データベースを作成します。

```
create database born;
```

設定が終わったら、以下の環境変数を設定します。

```
DATABASE_URL=postgresql://[username]:[password]@localhost:5432/born
```

6. 環境変数設定後、Prisma で マイグレーションを実行します

```
$ prisma migrate dev
```

データベースにテーブルが作成されているか確認します。

設定完了したら、APIでデータを取得できるように、以下コマンドを実行します

```
$ pnpm prisma generate
```

## GitHub 認証の環境構築

1. こちらの [GitHub 公式 Docs](https://docs.github.com/ja/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) に従って、開発用の OAuth App を作成します

開発用の場合、`homepage URL`, `Authorization callback URL` は `http://localhost:3000` で入力してください。

2. Client ID と Client Secret Key が発行されるので、それぞれ、以下の環境変数に設定します

```
AUTH_GITHUB_ID=[Client ID]
AUTH_GITHUB_SECRET=[Client Secret Key]
```

## その他環境変数の設定
その他の環境変数を、以下のように設定します。

```
NEXT_PUBLIC_EMAIL=[GitHub Accountで登録されているメールアドレス]
NEXTAUTH_URL=[クライアント側のURL(http://localhost:3000)]
NEXTAUTH_SECRET=[NextAuth で使用する認証シークレット用ハッシュ文字列(適当に作成してOK)]
NEXT_PUBLIC_BASIC_AUTH_USERNAME=[Basic認証用ユーザネーム]
NEXT_PUBLIC_BASIC_AUTH_PASSWORD=[Basic認証用パスワード]
NEXT_PUBLIC_BASE_URL=[クライアント側のURL(http://localhost:3000)]
```

## アプリ起動

以下コマンドで起動します。

```
$ pnpm dev
```

http://localhost:3000/signin にアクセスして、Basic認証後に Sign in of GitHub クリックして、ログインできるか確認してください。

### 使用権限について
現在は環境変数 NEXT_PUBLIC_EMAIL に設定してあるメールアドレスで登録された GitHub アカウントのみ、すべての機能を使用できるようにしております。
それ以外については、プログ記事の閲覧のみ有効です。

## テストについて

以下のテストを導入しています。

### フォーマットテスト

- Biome
- Prettier

### 単体テスト(コンポーネント/API)

- Jest
- React Testing Library

### E2E

- Playwright

テストは、CIで実行されますが、手動でも実行できます。

```bash
# Running Prettier & ESLint
$ pnpm lint

# Add Auto fix Option to Prettier & ESLint
$ pnpm fix:lint

# Running Unit Test
$ pnpm test

# Running E2E Test
$ pnpm e2e
```
