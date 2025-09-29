import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import {
  createPost,
  deletePostById,
  getAllPosts,
  getAllPostsByUserId,
  getPostById,
  updatePostById,
} from '../services/posts.service'
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth'

type Bindings = {
  DATABASE_URL: string
}

const posts = new Hono<{ Bindings: Bindings }>()

posts.get('/', async (c) => {
  try {
    const result = await getAllPosts(c.env)
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

posts.get(
  '/:id',
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const result = await getPostById(id, c.env)
      return c.json(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('No post with id')) {
        return c.json({ error: error.message }, 404)
      }
      return c.json({ error: 'Failed to fetch post' }, 500)
    }
  }
)

posts.get(
  '/user/:userId',
  zValidator('param', z.object({ userId: z.string() })),
  async (c) => {
    try {
      const { userId } = c.req.valid('param')
      const result = await getAllPostsByUserId(userId, c.env)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to fetch posts' }, 500)
    }
  }
)

posts.post(
  '/',
  authMiddleware,
  zValidator(
    'json',
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  async (c) => {
    try {
      const user = c.get('user')
      const { title, content } = c.req.valid('json')
      const result = await createPost(title, content, user.id, c.env)
      return c.json(result, 201)
    } catch (error) {
      return c.json({ error: 'Failed to create post' }, 500)
    }
  }
)

posts.put(
  '/:id',
  authMiddleware,
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  zValidator(
    'json',
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const { title, content } = c.req.valid('json')
      const result = await updatePostById(id, title, content, c.env)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to update post' }, 500)
    }
  }
)

posts.delete(
  '/:id',
  authMiddleware,
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const result = await deletePostById(id, c.env)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to delete post' }, 500)
    }
  }
)

export default posts