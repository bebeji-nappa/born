/**
 * XSS対策: HTMLタグとスクリプトをエスケープ
 */
export function sanitizeHtml(input: string | null | undefined): string | null {
  if (!input) return null;

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * 安全な文字列のみを許可（英数字、一部記号）
 */
export function sanitizeText(input: string | null | undefined): string | null {
  if (!input) return null;

  // 制御文字やスクリプトタグを削除
  return input
    .replace(/[\x00-\x1F\x7F]/g, "") // 制御文字削除
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // scriptタグ削除
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "") // iframeタグ削除
    .replace(/javascript:/gi, "") // javascript:プロトコル削除
    .replace(/on\w+\s*=/gi, "") // onイベント属性削除
    .trim();
}

/**
 * screen_name用: 英数字、ハイフン、アンダースコアのみ許可
 * スペースや他の記号は全て削除
 */
export function sanitizeScreenName(
  input: string | null | undefined,
): string | null {
  if (!input) return null;

  // 前後の空白を削除
  const trimmed = input.trim();

  // 英数字、ハイフン、アンダースコアのみ許可（スペース含む全ての記号を削除）
  const sanitized = trimmed.replace(/[^a-zA-Z0-9_-]/g, "");

  // 空文字列の場合はnullを返す
  if (!sanitized) return null;

  // 最大長制限（30文字）
  return sanitized.slice(0, 30);
}

/**
 * メールアドレス検証（追加の安全チェック）
 */
export function isValidEmail(email: string): boolean {
  // 基本的なメールアドレス形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // 最大長チェック
  if (email.length > 254) return false;

  // 危険な文字列チェック
  const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+=/i];

  return !dangerousPatterns.some((pattern) => pattern.test(email));
}

/**
 * 説明文用: 改行は許可、HTMLタグはエスケープ
 */
export function sanitizeDescription(
  input: string | null | undefined,
): string | null {
  if (!input) return null;

  // 最大長制限（例: 1000文字）
  const truncated = input.slice(0, 1000);

  // HTMLエスケープ
  return sanitizeHtml(truncated);
}
