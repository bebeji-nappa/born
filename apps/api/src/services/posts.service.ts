import { eq, and, desc } from 'drizzle-orm'
import { getDB, posts, users, blogs } from '../db'

export const getPostById = async (id: number, env: any) => {
  const db = getDB(env.DB)

  const result = await db
    .select({
      post: posts,
      user: {
        id: users.id,
        name: users.name,
        screen_name: users.screen_name,
        description: users.description,
        email: users.email,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, id))
    .get()

  if (!result) {
    throw new Error(`No post with id '${id}'`)
  }

  return {
    post: {
      ...result.post,
      user: result.user,
    },
  }
}

export const getAllPostsByUserId = async (
  userId: string,
  published: true | undefined,
  env: any,
  page: number = 1,
  limit: number = 10
) => {
  const db = getDB(env.DB)

  const conditions = published !== undefined
    ? and(eq(posts.userId, userId), eq(posts.published, published))
    : eq(posts.userId, userId)

  // 総数を取得
  const totalResult = await db
    .select({ count: posts.id })
    .from(posts)
    .where(conditions)
    .all()
  const total = totalResult.length

  // ページネーションを適用してデータを取得
  const offset = (page - 1) * limit
  const results = await db
    .select({
      post: posts,
      user: {
        id: users.id,
        name: users.name,
        screen_name: users.screen_name,
        description: users.description,
        email: users.email,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(conditions)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)
    .all()

  return {
    posts: results.map(r => ({
      ...r.post,
      user: r.user
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  }
}

export const updatePostById = async (
  id: number,
  title: string,
  content: string,
  published: boolean,
  env: any,
) => {
  const db = getDB(env.DB)
  const data: any = {
    title,
    content,
    updatedAt: new Date().toISOString(),
  }
  if (published !== undefined) {
    data.published = published
  }

  const updatedPost = await db
    .update(posts)
    .set(data)
    .where(eq(posts.id, id))
    .returning()
    .get()

  return {
    updatedPost,
  }
}

export const deletePostById = async (id: number, env: any) => {
  const db = getDB(env.DB)
  await db.delete(posts).where(eq(posts.id, id))
  return {
    message: 'Post deleted successfully',
  }
}

export const getAllPosts = async (env: any, userId: string, published: boolean) => {
  const db = getDB(env.DB)

  const results = await db
    .select({
      post: posts,
      user: {
        id: users.id,
        name: users.name,
        screen_name: users.screen_name,
        description: users.description,
        email: users.email,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(and(eq(posts.published, published), eq(posts.userId, userId)))
    .orderBy(desc(posts.createdAt))
    .all()

  return {
    posts: results.map(r => ({
      ...r.post,
      user: r.user
    })),
  }
}

export const createPost = async (
  title: string,
  content: string,
  userId: string,
  published: boolean,
  env: any
) => {
  const db = getDB(env.DB)

  // ユーザーのBlogを取得
  const blog = await db.select().from(blogs).where(eq(blogs.userId, userId)).get()

  if (!blog) {
    throw new Error('Blog not found for user')
  }

  const newPost = await db
    .insert(posts)
    .values({
      title,
      content,
      userId,
      blogId: blog.id,
      published,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning()
    .get()

  return {
    newPost,
  }
}
