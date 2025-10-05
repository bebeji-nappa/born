import { createId } from '@paralleldrive/cuid2'

/**
 * CSRFトークンを生成
 */
export function generateCsrfToken(): string {
  return createId()
}

/**
 * CSRFトークンを検証
 * Double Submit Cookie パターン
 */
export function validateCsrfToken(cookieToken: string | undefined, headerToken: string | undefined): boolean {
  if (!cookieToken || !headerToken) {
    return false
  }

  // タイミング攻撃対策: 固定時間比較
  return timingSafeEqual(cookieToken, headerToken)
}

/**
 * タイミング攻撃対策の文字列比較
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}
