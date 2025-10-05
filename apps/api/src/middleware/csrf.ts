import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { validateCsrfToken } from "../lib/csrf";

/**
 * CSRF保護ミドルウェア
 * Double Submit Cookie パターンで検証
 */
export async function csrfProtection(c: Context): Promise<Response | void> {
  // 開発環境ではCSRF検証をスキップ（オプション）
  const isDevEnvironment = c.env.NODE_ENV === "development" || !c.env.NODE_ENV;
  if (isDevEnvironment) {
    return;
  }

  // CookieとヘッダーからCSRFトークンを取得
  const cookieToken = getCookie(c, "csrf-token");
  const headerToken = c.req.header("X-CSRF-Token");

  // トークン検証
  if (!validateCsrfToken(cookieToken, headerToken)) {
    return c.json(
      {
        error: "Invalid CSRF token",
        code: "CSRF_TOKEN_INVALID",
      },
      403,
    );
  }
}
