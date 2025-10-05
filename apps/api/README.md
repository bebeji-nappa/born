# API

## 開発サーバー起動

```bash
pnpm dev
```

## データベース

```bash
# マイグレーション生成
pnpm db:generate

# Drizzle Studio（DB管理画面）
pnpm db:studio

# ローカル環境にマイグレーション適用
pnpm d1:migrate:local

# Staging環境にマイグレーション適用
pnpm d1:migrate:staging

# Production環境にマイグレーション適用
pnpm d1:migrate:prod
```
