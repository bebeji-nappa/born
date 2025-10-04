import { eq } from 'drizzle-orm'
import { getDB, sessions, users } from '../db'
import { createId } from '@paralleldrive/cuid2'

export interface AuthUser {
  id: string
  email: string
  name: string
  screen_name: string | null
  image?: string | null
  description?: string | null
  github_id?: string | null
  createdAt: Date
}

export interface SessionData {
  sessionToken: string
  user: AuthUser
  expires: Date
}

export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function createSession(userId: string, env: any): Promise<string> {
  const db = getDB(env.DB)
  const sessionToken = generateSessionToken()
  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // 7 days from now

  await db.insert(sessions).values({
    id: createId(),
    sessionToken,
    userId,
    expires,
  })

  return sessionToken
}

export async function getSessionUser(sessionToken: string, env: any): Promise<AuthUser | null> {
  const db = getDB(env.DB)

  const result = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.sessionToken, sessionToken))
    .get()

  if (!result || result.session.expires < new Date()) {
    if (result) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
    }
    return null
  }

  return {
    id: result.user.id,
    email: result.user.email!,
    name: result.user.name!,
    screen_name: result.user.screen_name,
    image: result.user.image,
    description: result.user.description,
    github_id: result.user.github_id,
    createdAt: new Date(result.user.createdAt!),
  }
}

export async function deleteSession(sessionToken: string, env: any): Promise<void> {
  const db = getDB(env.DB)
  try {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
  } catch {
    // Ignore errors if session doesn't exist
  }
}

export function getGitHubOAuthConfig(env: any) {
  return {
    clientId: env.AUTH_GITHUB_ID!,
    clientSecret: env.AUTH_GITHUB_SECRET!,
    redirectUri: `${env.API_BASE_URL || 'http://localhost:8000'}/api/auth/callback/github`,
    scope: 'user:email',
  }
}
