import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { csrfProtection } from '../middleware/csrf'

type Bindings = {
  STORAGE: R2Bucket
  FRONTEND_URL: string
  STORAGE_URL: string
  NODE_ENV: string
}

const upload = new Hono<{ Bindings: Bindings }>()

// 画像アップロード
upload.post('/', async (c) => {
  try {
    // CSRF保護
    const csrfError = await csrfProtection(c)
    if (csrfError) {
      return csrfError
    }

    const sessionToken = getCookie(c, 'session-token')
    if (!sessionToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

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

    // ファイルサイズのチェック（5MB制限）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return c.json({ error: 'File size exceeds 5MB limit' }, 400)
    }

    // ユニークなファイル名を生成
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const ext = file.name.split('.').pop()
    const key = `uploads/${timestamp}-${randomStr}.${ext}`

    // R2にアップロード
    await c.env.STORAGE.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // 公開URLを返す（環境変数から取得）
    const storageUrl = c.env.STORAGE_URL || 'https://storage.born-docs.com'
    const url = `${storageUrl}/${key}`

    return c.json({
      success: true,
      url,
      key,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 画像削除
upload.delete('/:key', async (c) => {
  try {
    // CSRF保護
    const csrfError = await csrfProtection(c)
    if (csrfError) {
      return csrfError
    }

    const sessionToken = getCookie(c, 'session-token')
    if (!sessionToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const key = c.req.param('key')

    await c.env.STORAGE.delete(key)

    return c.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default upload
