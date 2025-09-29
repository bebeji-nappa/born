import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import {
  getAll,
  getAuthUserId,
  getUserbyEmail,
  getUserbyId,
} from '../services/users.service'

const users = new Hono()

users.get('/', async (c) => {
  try {
    const result = await getAll()
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

users.get(
  '/auth-id',
  zValidator('query', z.object({ email: z.string().email() })),
  async (c) => {
    try {
      const { email } = c.req.valid('query')
      const result = await getAuthUserId(email)
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
      const result = await getUserbyEmail(email)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to fetch user by email' }, 500)
    }
  }
)

users.get(
  '/:id',
  zValidator('param', z.object({ id: z.string() })),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const result = await getUserbyId(id)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to fetch user' }, 500)
    }
  }
)

export default users
