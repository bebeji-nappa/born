import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { createSession, getSessionUser, deleteSession, getGitHubOAuthConfig, type AuthUser } from '../lib/auth'
import { prisma } from '../lib/prisma'

const auth = new Hono()

const config = getGitHubOAuthConfig()

auth.get('/signin/github', async (c) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=${Math.random().toString(36)}`
  
  return c.redirect(authUrl)
})

auth.get('/callback/github', async (c) => {
  try {
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

    const tokenData = await tokenResponse.json()
    
    if (!tokenData.access_token) {
      return c.json({ error: 'Failed to get access token' }, 400)
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const githubUser = await userResponse.json()

    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const emails = await emailResponse.json()
    const primaryEmail = emails.find((email: any) => email.primary)?.email || githubUser.email

    if (!primaryEmail || primaryEmail !== process.env.ALLOW_EMAIL) {
      return c.json({ error: 'Unauthorized email address' }, 403)
    }

    let user = await prisma.user.findUnique({
      where: { email: primaryEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          name: githubUser.name || githubUser.login,
          image: githubUser.avatar_url,
        }
      })
    } else {
      user = await prisma.user.update({
        where: { email: primaryEmail },
        data: {
          name: githubUser.name || githubUser.login,
          image: githubUser.avatar_url,
        }
      })
    }

    // Check if GitHub account already exists
    let account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'github',
          providerAccountId: githubUser.id.toString(),
        }
      }
    })

    if (!account) {
      account = await prisma.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: 'github',
          providerAccountId: githubUser.id.toString(),
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
        }
      })
    } else {
      // Update access token
      account = await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
        }
      })
    }

    const sessionToken = await createSession(user.id)
    
    setCookie(c, 'session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    return c.redirect(frontendUrl)
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    return c.json({ error: 'Authentication failed' }, 500)
  }
})

auth.post('/signout', async (c) => {
  const sessionToken = getCookie(c, 'session-token')
  
  if (sessionToken) {
    await deleteSession(sessionToken)
  }
  
  deleteCookie(c, 'session-token')
  return c.json({ message: 'Signed out successfully' })
})

auth.get('/current_user', async (c) => {
  const sessionToken = getCookie(c, 'session-token')
  
  if (!sessionToken) {
    return c.json({ error: 'Not authenticated' }, 401)
  }

  const user = await getSessionUser(sessionToken)
  
  if (!user) {
    return c.json({ error: 'Invalid session' }, 401)
  }

  return c.json({ user })
})

export default auth
