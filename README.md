# Born

## 使用技術

技術的な深掘りも目的としてあるので、実験的な技術選定にしています。

- Framework
  - Next.js
- API
  - tRPC
  - Prisma Client
- DB
  - Supabase

## 事前準備

1. 以下コマンドで .env を作成します

```
$ cp .env.sample .env
```

2. [Homebrew 公式サイト](https://brew.sh/ja/)から、Homebrew をインストールします。

3. Homebrew で Docker をインストールします。

```
$ brew install --cask docker
```

4. pnpm install を実行します

```
$ pnpm install
```

5. DB を設定します。
homebrew で mysql をインストールします。

```
$ brew install mysql
```

mysql を起動して、以下の SQL born データベースを作成します。

```
create database born;
```

設定が終わったら、以下の環境変数を設定します。

```
DATABASE_URL=mysql://[username]:[password]@localhost:3306/born
```

6. 環境変数設定後、Prisma で マイグレーションを実行します

```
$ prisma migrate dev
```

MySQL でテーブルが作成されているか確認します。

設定完了したら、APIでデータを取得できるように、以下コマンドを実行します

```
$ pnpm prisma generate
```

## GitHub 認証の環境構築

1. こちらの [GitHub 公式 Docs](https://docs.github.com/ja/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) に従って、開発用の OAuth App を作成します

`homepage URL`, `Authorization callback URL` は `http://localhost:3000` で入力してください。

2. Client ID と Client Secret Key が発行されるので、それぞれ、以下の環境変数に設定します

```
GITHUB_ID=[Client ID]
GITHUB_SECRET=[Client Secret Key]
```

## アプリ起動

以下コマンドで起動します。

```
$ pnpm dev
```

http://localhost:3000/signin にアクセスして、Sign in of GitHub クリックして、ログインできるか確認してください。

## テストについて

以下のテストを導入しています。

### フォーマットテスト

- ESLint
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

## commit について

Husky を導入しており、基本的に pre-push 時にE2E以外のテストを実行しています。

`--no-verify` オプションでテストを回避して、push 出来ます。

```bash
git push --no-verify origin

```
