import { randomBytes } from 'crypto'
import { prisma } from './prisma'

export interface AuthUser {
  id: string
  email: string
  name: string
  image?: string | null
}

export interface SessionData {
  sessionToken: string
  user: AuthUser
  expires: Date
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createSession(userId: string): Promise<string> {
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

export async function getSessionUser(sessionToken: string): Promise<AuthUser | null> {
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
    image: session.user.image,
  }
}

export async function deleteSession(sessionToken: string): Promise<void> {
  await prisma.session.delete({
    where: { sessionToken },
  }).catch(() => {
    // Ignore errors if session doesn't exist
  })
}

export function getGitHubOAuthConfig() {
  return {
    clientId: process.env.AUTH_GITHUB_ID!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
    redirectUri: `${process.env.API_BASE_URL || 'http://localhost:8000'}/api/auth/callback/github`,
    scope: 'user:email',
  }
}
