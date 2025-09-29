import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { getSessionUser, type AuthUser } from '../lib/auth'

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const sessionToken = getCookie(c, 'session-token')
  
  if (!sessionToken) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  const user = await getSessionUser(sessionToken)
  
  if (!user) {
    return c.json({ error: 'Invalid session' }, 401)
  }

  c.set('user', user)
  await next()
}

export async function optionalAuthMiddleware(c: Context, next: Next) {
  const sessionToken = getCookie(c, 'session-token')
  
  if (sessionToken) {
    const user = await getSessionUser(sessionToken)
    if (user) {
      c.set('user', user)
    }
  }
  
  await next()
}