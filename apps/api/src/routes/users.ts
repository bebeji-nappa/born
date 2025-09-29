import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import {
  getAll,
  getAuthUserId,
  getUserbyEmail,
  getUserbyId,
} from '../services/users.service'

type Bindings = {
  DATABASE_URL: string
}

const users = new Hono<{ Bindings: Bindings }>()

users.get('/', async (c) => {
  try {
    const result = await getAll(c.env)
    return c.json(result)
  } catch (error) {
    console.error('Users fetch error:', error)
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

users.get(
  '/auth-id',
  zValidator('query', z.object({ email: z.string().email() })),
  async (c) => {
    try {
      const { email } = c.req.valid('query')
      const result = await getAuthUserId(email, c.env)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to fetch user ID' }, 500)
    }
  }
)

users.get(
  '/by-email',
  zValidator('query', z.object({ email: z.string().email() })),
  async (c) => {
    try {
      const { email } = c.req.valid('query')
      const result = await getUserbyEmail(email, c.env)
      return c.json(result)
    } catch (error) {
      return c.json({ error: error }, 500)
    }
  }
)

users.get(
  '/:id',
  zValidator('param', z.object({ id: z.string() })),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const result = await getUserbyId(id, c.env)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to fetch user' }, 500)
    }
  }
)

export default users
