import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getCookie } from 'hono/cookie'
import { eq } from 'drizzle-orm'
import { getDB, users as usersTable, sessions } from '../db'
import {
  getAll,
  getAuthUserId,
  getUserbyEmail,
  getUserbyId,
} from '../services/users.service'

type Bindings = {
  DATABASE_URL: string
  DB: D1Database
  STORAGE: R2Bucket
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
      const result = await getUserbyId(id, c.env)
      return c.json(result)
    } catch (error) {
      return c.json({ error: 'Failed to fetch user' }, 500)
    }
  }
)

// ユーザー情報更新
users.put('/profile', async (c) => {
  try {
    const sessionToken = getCookie(c, 'session-token')
    if (!sessionToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // セッションからユーザーを取得
    const db = getDB(c.env.DB)
    const result = await db
      .select({ session: sessions, user: usersTable })
      .from(sessions)
      .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .get()

    if (!result || !result.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { name, description } = body

    // 更新データの準備
    const updateData: { name?: string; description?: string | null } = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description

    // ユーザー情報を更新
    const updatedUser = await db.update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, result.user.id))
      .returning()
      .get()

    return c.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        screen_name: updatedUser.screen_name,
        image: updatedUser.image,
        description: updatedUser.description,
        createdAt: new Date(updatedUser.createdAt!).toISOString(),
      },
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ユーザID（screen_name）更新
users.put('/screen-name', async (c) => {
  try {
    const sessionToken = getCookie(c, 'session-token')
    if (!sessionToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // セッションからユーザーを取得
    const db = getDB(c.env.DB)
    const result = await db
      .select({ session: sessions, user: usersTable })
      .from(sessions)
      .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .get()

    if (!result || !result.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { screen_name } = body

    if (screen_name === undefined) {
      return c.json({ error: 'screen_name is required' }, 400)
    }

    // ユーザIDを更新
    const updatedUser = await db.update(usersTable)
      .set({ screen_name: screen_name || null })
      .where(eq(usersTable.id, result.user.id))
      .returning()
      .get()

    return c.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        screen_name: updatedUser.screen_name,
        image: updatedUser.image,
        description: updatedUser.description,
        createdAt: new Date(updatedUser.createdAt!).toISOString(),
      },
    })
  } catch (error) {
    console.error('Screen name update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// アバター画像更新
users.put('/avatar/image', async (c) => {
  try {
    const sessionToken = getCookie(c, 'session-token')
    if (!sessionToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // セッションからユーザーを取得
    const db = getDB(c.env.DB)
    const result = await db
      .select({ session: sessions, user: usersTable })
      .from(sessions)
      .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .get()

    if (!result || !result.user) {
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

    // ファイルサイズのチェック（2MB制限）
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return c.json({ error: 'File size exceeds 2MB limit' }, 400)
    }

    // 既存のアバターがあれば削除
    if (result.user.image) {
      try {
        const oldKey = result.user.image.replace('https://storage.bebeji-nappa.com/', '')
        await c.env.STORAGE.delete(oldKey)
      } catch (error) {
        console.error('Failed to delete old avatar:', error)
      }
    }

    // ユニークなファイル名を生成
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const key = `avatars/${result.user.id}/${timestamp}.${ext}`

    // R2にアップロード
    await c.env.STORAGE.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // 公開URLを生成
    const url = `https://storage.bebeji-nappa.com/${key}`

    // ユーザーのimageフィールドを更新
    const updatedUser = await db.update(usersTable)
      .set({ image: url })
      .where(eq(usersTable.id, result.user.id))
      .returning()
      .get()

    return c.json({
      success: true,
      url,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        screen_name: updatedUser.screen_name,
        image: updatedUser.image,
        description: updatedUser.description,
        createdAt: new Date(updatedUser.createdAt!).toISOString(),
      },
    })
  } catch (error) {
    console.error('Avatar update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default users
