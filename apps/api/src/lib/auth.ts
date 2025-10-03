import { getPrismaClient } from './prisma'

export interface AuthUser {
  id: string
  email: string
  name: string
  screen_name: string | null
  image?: string | null
  description?: string | null
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
  const prisma = getPrismaClient(env)
  const sessionToken = generateSessionToken()
  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // 7 days from now

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  })

  return sessionToken
}

export async function getSessionUser(sessionToken: string, env: any): Promise<AuthUser | null> {
  const prisma = getPrismaClient(env)
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: true,
    },
  })

  if (!session || session.expires < new Date()) {
    if (session) {
      await prisma.session.delete({
        where: { sessionToken },
      })
    }
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name!,
    screen_name: session.user.screen_name,
    image: session.user.image,
    description: session.user.description,
    createdAt: session.user.createdAt,
  }
}

export async function deleteSession(sessionToken: string, env: any): Promise<void> {
  const prisma = getPrismaClient(env)
  await prisma.session.delete({
    where: { sessionToken },
  }).catch(() => {
    // Ignore errors if session doesn't exist
  })
}

export function getGitHubOAuthConfig(env: any) {
  return {
    clientId: env.AUTH_GITHUB_ID!,
    clientSecret: env.AUTH_GITHUB_SECRET!,
    redirectUri: `${env.API_BASE_URL || 'http://localhost:8000'}/api/auth/callback/github`,
    scope: 'user:email',
  }
}
