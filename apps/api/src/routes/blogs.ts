import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getBlogById, getBlogByUserId, updateBlog, updateBlogBackgroundImage, deleteBlogBackgroundImage } from '../services/blogs.service'
import { authMiddleware } from '../middleware/auth'
import { csrfProtection } from '../middleware/csrf'

type Bindings = {
  DB: any
  STORAGE: R2Bucket
  STORAGE_URL: string
  NODE_ENV: string
  API_BASE_URL: string
}

const blogs = new Hono<{ Bindings: Bindings }>()

// Serve background images from R2
blogs.get('/background-image/:key{.+}', async (c) => {
  try {
    const key = c.req.param('key')
    const object = await c.env.STORAGE.get(key)

    if (!object) {
      return c.json({ error: 'Image not found' }, 404)
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Background image fetch error:', error)
    return c.json({ error: 'Failed to fetch background image' }, 500)
  }
})

blogs.get('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const result = await getBlogByUserId(userId, c.env)
    return c.json(result)
  } catch (error) {
    if (error instanceof Error && error.message.includes('No blog')) {
      return c.json({ error: error.message }, 404)
    }
    return c.json({ error: 'Failed to fetch blog' }, 500)
  }
})

blogs.get(
  '/:id',
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  async (c) => {
    try {
      const { id } = c.req.valid('param')
      const result = await getBlogById(id, c.env)
      return c.json(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('No blog')) {
        return c.json({ error: error.message }, 404)
      }
      return c.json({ error: 'Failed to fetch blog' }, 500)
    }
  }
)

blogs.put(
  '/:id',
  authMiddleware,
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  zValidator(
    'json',
    z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      theme: z.string().nullable(),
    })
  ),
  async (c) => {
    try {
      // CSRF保護
      const csrfError = await csrfProtection(c)
      if (csrfError) {
        return csrfError
      }

      const { id } = c.req.valid('param')
      const { title, description, theme } = c.req.valid('json')
      const result = await updateBlog(id, title, description, theme, c.env)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to update blog' }, 500)
    }
  }
)

// Upload background image
blogs.post(
  '/:id/background-image',
  authMiddleware,
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  async (c) => {
    try {
      // CSRF保護
      const csrfError = await csrfProtection(c)
      if (csrfError) {
        return csrfError
      }

      const { id } = c.req.valid('param')
      const formData = await c.req.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return c.json({ error: 'No file provided' }, 400)
      }

      // ファイルタイプのチェック
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return c.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }, 400)
      }

      // ファイルサイズのチェック（10MB制限）
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return c.json({ error: 'File size exceeds 10MB limit' }, 400)
      }

      // ユニークなファイル名を生成
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 15)
      const ext = file.name.split('.').pop()
      const key = `blog-backgrounds/${timestamp}-${randomStr}.${ext}`

      // R2にアップロード
      await c.env.STORAGE.put(key, await file.arrayBuffer(), {
        httpMetadata: {
          contentType: file.type,
        },
      })

      // 公開URLを返す（環境変数から取得）
      // ローカル開発環境ではAPIサーバー経由で画像を配信
      const nodeEnv = c.env.NODE_ENV || 'development'
      let storageUrl: string

      if (nodeEnv === 'development') {
        // ローカル開発: APIサーバー経由
        storageUrl = `${c.env.API_BASE_URL || 'http://localhost:8000'}/api/blogs/background-image`
      } else if (nodeEnv === 'staging') {
        // Staging: カスタムドメイン
        storageUrl = c.env.STORAGE_URL || 'https://staging-storage.born-docs.com'
      } else {
        // Production: カスタムドメイン
        storageUrl = c.env.STORAGE_URL || 'https://storage.born-docs.com'
      }

      const url = `${storageUrl}/${key}`

      // データベースを更新
      const result = await updateBlogBackgroundImage(id, url, key, c.env)

      return c.json({
        success: true,
        blog: result.blog,
      })
    } catch (error) {
      console.error('Background image upload error:', error)
      return c.json({ error: 'Failed to upload background image' }, 500)
    }
  }
)

// Delete background image
blogs.delete(
  '/:id/background-image',
  authMiddleware,
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  async (c) => {
    try {
      // CSRF保護
      const csrfError = await csrfProtection(c)
      if (csrfError) {
        return csrfError
      }

      const { id } = c.req.valid('param')
      const result = await deleteBlogBackgroundImage(id, c.env)

      // R2から削除
      if (result.deletedKey) {
        await c.env.STORAGE.delete(result.deletedKey)
      }

      return c.json({
        success: true,
        message: 'Background image deleted successfully',
      })
    } catch (error) {
      console.error('Background image delete error:', error)
      return c.json({ error: 'Failed to delete background image' }, 500)
    }
  }
)

export default blogs
