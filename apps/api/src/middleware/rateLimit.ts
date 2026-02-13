import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { getDB, rateLimits } from "../db";

interface RateLimitConfig {
  windowMs: number; // 時間ウィンドウ (ミリ秒)
  maxRequests: number; // 最大リクエスト数
  blockDurationMs: number; // ブロック期間 (ミリ秒)
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分
  maxRequests: 5, // 5回まで
  blockDurationMs: 30 * 60 * 1000, // 30分ブロック
};

/**
 * レート制限ミドルウェア
 * - 15分間に5回まで許可
 * - 6回目の失敗で30分間ブロック
 */
export async function rateLimitMiddleware(
  c: Context,
  endpoint: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
): Promise<Response | undefined> {
  const db = getDB(c.env.DB);

  // IPアドレス取得
  const ip =
    c.req.header("cf-connecting-ip") ||
    c.req.header("x-forwarded-for") ||
    c.req.header("x-real-ip") ||
    "unknown";

  const key = `${ip}:${endpoint}`;
  const now = Date.now();

  // 既存のレコード取得
  const existing = await db
    .select()
    .from(rateLimits)
    .where(eq(rateLimits.key, key))
    .get();

  // ブロックチェック
  if (existing?.blockedUntil && existing.blockedUntil > now) {
    const remainingMinutes = Math.ceil((existing.blockedUntil - now) / 60000);
    return c.json(
      {
        error: `Too many failed attempts. Please try again in ${remainingMinutes} minutes.`,
        code: "RATE_LIMIT_BLOCKED",
        retryAfter: remainingMinutes,
      },
      429,
    );
  }

  // ウィンドウ期限チェック
  const isWindowExpired =
    !existing || now - existing.windowStart > config.windowMs;

  if (isWindowExpired) {
    // 新しいウィンドウ開始
    if (existing) {
      await db.delete(rateLimits).where(eq(rateLimits.key, key)).run();
    }
    await db
      .insert(rateLimits)
      .values({
        key,
        requestCount: 1,
        windowStart: now,
        blockedUntil: null,
        expiresAt: now + config.windowMs + config.blockDurationMs, // 最大保持期間
      })
      .run();
    return;
  }

  // リクエスト数をインクリメント
  const newCount = existing.requestCount + 1;

  // 6回目の失敗でブロック
  if (newCount >= config.maxRequests + 1) {
    const blockedUntil = now + config.blockDurationMs;
    await db
      .update(rateLimits)
      .set({
        requestCount: newCount,
        blockedUntil,
        expiresAt: blockedUntil,
      })
      .where(eq(rateLimits.key, key))
      .run();

    const remainingMinutes = Math.ceil(config.blockDurationMs / 60000);
    return c.json(
      {
        error: `Too many failed attempts. You are blocked for ${remainingMinutes} minutes.`,
        code: "RATE_LIMIT_BLOCKED",
        retryAfter: remainingMinutes,
      },
      429,
    );
  }

  // 通常のレート制限チェック (5回まで)
  if (newCount > config.maxRequests) {
    await db
      .update(rateLimits)
      .set({ requestCount: newCount })
      .where(eq(rateLimits.key, key))
      .run();

    return c.json(
      {
        error: "Too many requests. Please try again later.",
      },
      429,
    );
  }

  // カウントを更新
  await db
    .update(rateLimits)
    .set({ requestCount: newCount })
    .where(eq(rateLimits.key, key))
    .run();
}
