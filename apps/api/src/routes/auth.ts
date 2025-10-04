import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { createSession, getSessionUser, deleteSession, getGitHubOAuthConfig, type AuthUser } from '../lib/auth'
import { createId } from '@paralleldrive/cuid2'
import { eq, and } from 'drizzle-orm'
import { getDB, users, accounts, blogs } from '../db'
import * as bcrypt from 'bcryptjs'

type Bindings = {
  DB: D1Database
  AUTH_GITHUB_ID: string
  AUTH_GITHUB_SECRET: string
  API_BASE_URL: string
  FRONTEND_URL: string
  ALLOW_EMAIL: string
  NODE_ENV: string
}

type GitHubUser = {
  id: number
  login: string
  name: string | null
  email: string | null
  avatar_url: string
}

type GitHubEmail = {
  email: string
  primary: boolean
  verified: boolean
}

const auth = new Hono<{ Bindings: Bindings }>()

auth.get('/signin/github', async (c) => {
  const config = getGitHubOAuthConfig(c.env)
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=${Math.random().toString(36)}`
  
  return c.redirect(authUrl)
})

auth.get('/callback/github', async (c) => {
  try {
    const config = getGitHubOAuthConfig(c.env)
    const db = getDB(c.env.DB)
    const code = c.req.query('code')

    if (!code) {
      return c.json({ error: 'Authorization code not found' }, 400)
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        redirect_uri: config.redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('GitHub token response error:', tokenResponse.status, errorText)
      return c.json({ error: 'Failed to get access token from GitHub' }, 400)
    }

    const tokenText = await tokenResponse.text()

    let tokenData
    try {
      tokenData = JSON.parse(tokenText)
    } catch (error) {
      console.error('Failed to parse GitHub token response as JSON:', tokenText)
      return c.json({ error: 'Invalid response from GitHub' }, 400)
    }

    if (!tokenData.access_token) {
      return c.json({ error: 'Failed to get access token' }, 400)
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Born-API/1.0',
      },
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('GitHub user API error:', userResponse.status, errorText)
      return c.json({ error: 'Failed to get user from GitHub' }, 400)
    }

    const githubUser = await userResponse.json() as GitHubUser

    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Born-API/1.0',
      },
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('GitHub email API error:', emailResponse.status, errorText)
      return c.json({ error: 'Failed to get emails from GitHub' }, 400)
    }

    const emails = await emailResponse.json() as GitHubEmail[]
    const primaryEmail = emails.find((email) => email.primary)?.email || githubUser.email

    if (!primaryEmail || primaryEmail !== c.env.ALLOW_EMAIL) {
      return c.json({ error: 'Unauthorized email address' }, 403)
    }

    let user = await db.select().from(users).where(eq(users.email, primaryEmail)).get()

    if (!user) {
      const userId = createId()
      const newUser = await db.insert(users).values({
        id: userId,
        email: primaryEmail,
        name: githubUser.name || githubUser.login,
        image: githubUser.avatar_url,
        screen_name: userId,
        createdAt: new Date().toISOString(),
      }).returning().get()

      user = newUser

      // ユーザー登録時にBlogを作成
      await db.insert(blogs).values({
        userId: user.id,
        title: null,
        description: null,
        theme: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } else {
      const updatedUser = await db.update(users)
        .set({
          name: githubUser.name || githubUser.login,
          image: githubUser.avatar_url,
        })
        .where(eq(users.email, primaryEmail))
        .returning()
        .get()

      user = updatedUser
    }

    // Check if GitHub account already exists
    let account = await db.select().from(accounts)
      .where(and(
        eq(accounts.provider, 'github'),
        eq(accounts.providerAccountId, githubUser.id.toString())
      ))
      .get()

    if (!account) {
      await db.insert(accounts).values({
        id: createId(),
        userId: user.id,
        type: 'oauth',
        provider: 'github',
        providerAccountId: githubUser.id.toString(),
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      })
    } else {
      // Update access token
      await db.update(accounts)
        .set({
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
        })
        .where(eq(accounts.id, account.id))
    }

    const sessionToken = await createSession(user.id, c.env)

    setCookie(c, 'session-token', sessionToken, {
      httpOnly: true,
      secure: true, // Always secure in Workers
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const frontendUrl = c.env.FRONTEND_URL || 'http://localhost:3000'
    return c.redirect(frontendUrl)
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    return c.json({ error: 'Authentication failed' }, 500)
  }
})

auth.post('/signout', async (c) => {
  const sessionToken = getCookie(c, 'session-token')
  
  if (sessionToken) {
    await deleteSession(sessionToken, c.env)
  }
  
  deleteCookie(c, 'session-token')
  return c.json({ message: 'Signed out successfully' })
})

auth.get('/current_user', async (c) => {
  const sessionToken = getCookie(c, 'session-token')

  if (!sessionToken) {
    return c.json({ error: 'Not authenticated' }, 401)
  }

  let user = await getSessionUser(sessionToken, c.env)

  if (!user) {
    return c.json({ error: 'Invalid session' }, 401)
  }

  // If screen_name is null, set it to user.id
  if (!user.screen_name) {
    const db = getDB(c.env.DB)
    const updatedUser = await db.update(users)
      .set({ screen_name: user.id })
      .where(eq(users.id, user.id))
      .returning()
      .get()

    user = {
      ...user,
      screen_name: updatedUser.screen_name,
    }
  }

  return c.json({ user })
})

// ログイン
auth.post(
  '/signin',
  zValidator('json', z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })),
  async (c) => {
    try {
      const { email, password } = c.req.valid('json')
      const db = getDB(c.env.DB)

      // ユーザーの存在確認
      const user = await db.select().from(users).where(eq(users.email, email)).get()
      if (!user || !user.hash) {
        return c.json({ error: 'Invalid email or password' }, 401)
      }

      // パスワード検証
      const isPasswordValid = await bcrypt.compare(password, user.hash)
      if (!isPasswordValid) {
        return c.json({ error: 'Invalid email or password' }, 401)
      }

      // セッション作成
      const sessionToken = await createSession(user.id, c.env)

      setCookie(c, 'session-token', sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return c.json({
        success: true,
        message: 'Signed in successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      })
    } catch (error) {
      console.error('Sign in error:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

// 新規登録
auth.post(
  '/signup',
  zValidator('json', z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string()
  })),
  async (c) => {
    try {
      const { email, password, passwordConfirmation } = c.req.valid('json')

      // パスワード確認チェック
      if (password !== passwordConfirmation) {
        return c.json({ error: 'Passwords do not match' }, 400)
      }

      // パスワード強度チェック
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
        return c.json({ error: 'Password must contain uppercase, lowercase, number, and symbol' }, 400)
      }

      const db = getDB(c.env.DB)

      // メールアドレスの重複チェック
      const existingUser = await db.select().from(users).where(eq(users.email, email)).get()
      if (existingUser) {
        return c.json({ error: 'Email already exists' }, 400)
      }

      // パスワードをハッシュ化
      const saltRounds = 10
      const hash = await bcrypt.hash(password, saltRounds)

      // ユーザー作成
      const userId = createId()
      const newUser = await db.insert(users).values({
        id: userId,
        email,
        name: null,
        hash,
        screen_name: userId,
        createdAt: new Date().toISOString(),
      }).returning().get()

      // ユーザー登録時にBlogを作成
      await db.insert(blogs).values({
        userId: newUser.id,
        title: null,
        description: null,
        theme: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).run()

      return c.json({
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        }
      })
    } catch (error) {
      console.error('Sign up error:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

export default auth
