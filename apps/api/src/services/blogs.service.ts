import { eq } from "drizzle-orm";
import { getDB, blogs } from "../db";

export const getBlogById = async (id: number, env: any) => {
  const db = getDB(env.DB);
  const blog = await db.select().from(blogs).where(eq(blogs.id, id)).get();

  if (!blog) {
    throw new Error(`No blog with id '${id}'`);
  }

  return { blog };
};

export const getBlogByUserId = async (userId: string, env: any) => {
  const db = getDB(env.DB);
  const blog = await db
    .select()
    .from(blogs)
    .where(eq(blogs.userId, userId))
    .get();

  if (!blog) {
    throw new Error(`No blog for user '${userId}'`);
  }

  return { blog };
};

export const updateBlog = async (
  id: number,
  title: string | null,
  description: string | null,
  theme: string | null,
  env: any,
) => {
  const db = getDB(env.DB);

  const updatedBlog = await db
    .update(blogs)
    .set({
      title,
      description,
      theme,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(blogs.id, id))
    .returning()
    .get();

  return { blog: updatedBlog };
};

export const updateBlogBackgroundImage = async (
  id: number,
  backgroundImage: string,
  backgroundImageKey: string,
  env: any,
) => {
  const db = getDB(env.DB);

  // 既存の背景画像を取得（削除用）
  const existingBlog = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, id))
    .get();

  const updatedBlog = await db
    .update(blogs)
    .set({
      backgroundImage,
      backgroundImageKey,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(blogs.id, id))
    .returning()
    .get();

  return {
    blog: updatedBlog,
    oldKey: existingBlog?.backgroundImageKey || null,
  };
};

export const deleteBlogBackgroundImage = async (id: number, env: any) => {
  const db = getDB(env.DB);

  // 現在の背景画像キーを取得
  const blog = await db.select().from(blogs).where(eq(blogs.id, id)).get();

  if (!blog) {
    throw new Error(`No blog with id '${id}'`);
  }

  const deletedKey = blog.backgroundImageKey;

  // 背景画像をクリア
  await db
    .update(blogs)
    .set({
      backgroundImage: null,
      backgroundImageKey: null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(blogs.id, id))
    .returning()
    .get();

  return { deletedKey };
};
