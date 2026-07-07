import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { type EnvWithDB, getDB, sessions, users } from "../db";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  screen_name: string | null;
  image?: string | null;
  description?: string | null;
  github_id?: string | null;
  createdAt: Date;
}

export interface SessionData {
  sessionToken: string;
  user: AuthUser;
  expires: Date;
}

export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export async function createSession(
  userId: string,
  env: EnvWithDB,
): Promise<string> {
  const db = getDB(env.DB);
  const sessionToken = generateSessionToken();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7 days from now

  await db.insert(sessions).values({
    id: createId(),
    sessionToken,
    userId,
    expires,
  });

  return sessionToken;
}

export async function getSessionUser(
  sessionToken: string,
  env: EnvWithDB,
): Promise<AuthUser | null> {
  const db = getDB(env.DB);

  const result = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.sessionToken, sessionToken))
    .get();

  if (!result || result.session.expires < new Date()) {
    if (result) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    }
    return null;
  }

  return {
    id: result.user.id,
    email: result.user.email ?? "",
    name: result.user.name ?? "",
    screen_name: result.user.screen_name,
    image: result.user.image,
    description: result.user.description,
    github_id: result.user.github_id,
    createdAt: new Date(result.user.createdAt),
  };
}

export async function deleteSession(
  sessionToken: string,
  env: EnvWithDB,
): Promise<void> {
  const db = getDB(env.DB);
  try {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  } catch {
    // Ignore errors if session doesn't exist
  }
}

/**
 * ユーザーの全セッションを無効化
 * パスワード変更時などに使用
 */
export async function deleteAllUserSessions(
  userId: string,
  env: EnvWithDB,
): Promise<void> {
  const db = getDB(env.DB);
  try {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  } catch (error) {
    console.error("Failed to delete user sessions:", error);
  }
}

/**
 * 期限切れセッションを削除
 * 定期的なクリーンアップ用
 */
export async function deleteExpiredSessions(env: EnvWithDB): Promise<number> {
  const db = getDB(env.DB);
  const now = new Date();

  try {
    const result = await db
      .delete(sessions)
      .where(eq(sessions.expires, now))
      .returning();

    return result.length;
  } catch (error) {
    console.error("Failed to delete expired sessions:", error);
    return 0;
  }
}

/**
 * セッションの有効期限を延長
 * アクティブなユーザーのセッション維持用
 */
export async function refreshSession(
  sessionToken: string,
  env: EnvWithDB,
): Promise<boolean> {
  const db = getDB(env.DB);
  const newExpires = new Date();
  newExpires.setDate(newExpires.getDate() + 7); // 7日延長

  try {
    const result = await db
      .update(sessions)
      .set({ expires: newExpires })
      .where(eq(sessions.sessionToken, sessionToken))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error("Failed to refresh session:", error);
    return false;
  }
}

export function getGitHubOAuthConfig(
  env: EnvWithDB & {
    AUTH_GITHUB_ID?: string;
    AUTH_GITHUB_SECRET?: string;
    API_BASE_URL?: string;
  },
) {
  const { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, API_BASE_URL } = env;

  if (!AUTH_GITHUB_ID || !AUTH_GITHUB_SECRET) {
    throw new Error("GitHub OAuth configuration is missing in environment");
  }

  return {
    clientId: AUTH_GITHUB_ID,
    clientSecret: AUTH_GITHUB_SECRET,
    redirectUri: `${API_BASE_URL || "http://localhost:8000"}/api/auth/callback/github`,
    scope: "user:email",
  };
}
