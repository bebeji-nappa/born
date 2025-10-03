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

export const getAllPostsByUserId = async (userId: string, published: true | undefined, env: any) => {
  const db = getDB(env.DB)

  const conditions = published !== undefined
    ? and(eq(posts.userId, userId), eq(posts.published, published))
    : eq(posts.userId, userId)

  const results = await db
    .select({
      post: posts,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(conditions)
    .orderBy(desc(posts.createdAt))
    .all()

  return {
    posts: results.map(r => ({
      ...r.post,
      user: r.user
    })),
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
    updatedAt: new Date(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()
    .get()

  return {
    newPost,
  }
}
