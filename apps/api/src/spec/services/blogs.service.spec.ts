import { env } from "cloudflare:test";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { blogs, getDB, users } from "../../db";
import {
  deleteBlogBackgroundImage,
  getBlogById,
  getBlogByUserId,
  updateBlog,
  updateBlogBackgroundImage,
} from "../../services/blogs.service";

describe("Blogs Service", () => {
  const testUserId = "test-user-1";

  beforeEach(async () => {
    const db = getDB(env.DB);

    // テストデータのクリーンアップ
    await db.delete(blogs);
    await db.delete(users);

    // テストユーザーを作成
    await db.insert(users).values({
      id: testUserId,
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date().toISOString(),
    });
  });

  describe("getBlogById", () => {
    it("指定したIDのブログを取得できる", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(blogs)
        .values({
          userId: testUserId,
          title: "Test Blog",
          description: "Test Description",
          theme: "default",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await getBlogById(inserted.id, env);

      expect(result.blog).not.toBeNull();
      expect(result.blog.title).toBe("Test Blog");
    });

    it("存在しないIDの場合、エラーをスローする", async () => {
      await expect(getBlogById(999, env)).rejects.toThrow(
        "No blog with id '999'",
      );
    });
  });

  describe("getBlogByUserId", () => {
    it("指定したユーザーIDのブログを取得できる", async () => {
      const db = getDB(env.DB);

      await db.insert(blogs).values({
        userId: testUserId,
        title: "User Blog",
        description: "User Description",
        theme: "dark",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const result = await getBlogByUserId(testUserId, env);

      expect(result.blog).not.toBeNull();
      expect(result.blog.userId).toBe(testUserId);
      expect(result.blog.title).toBe("User Blog");
    });

    it("ブログが存在しないユーザーIDの場合、エラーをスローする", async () => {
      await expect(getBlogByUserId("non-existent-user", env)).rejects.toThrow(
        "No blog for user 'non-existent-user'",
      );
    });
  });

  describe("updateBlog", () => {
    it("ブログ情報を更新できる", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(blogs)
        .values({
          userId: testUserId,
          title: "Original Title",
          description: "Original Description",
          theme: "light",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await updateBlog(
        inserted.id,
        "Updated Title",
        "Updated Description",
        "dark",
        env,
      );

      expect(result.blog.title).toBe("Updated Title");
      expect(result.blog.description).toBe("Updated Description");
      expect(result.blog.theme).toBe("dark");
    });

    it("null値でも更新できる", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(blogs)
        .values({
          userId: testUserId,
          title: "Original Title",
          description: "Original Description",
          theme: "light",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await updateBlog(inserted.id, null, null, null, env);

      expect(result.blog.title).toBeNull();
      expect(result.blog.description).toBeNull();
      expect(result.blog.theme).toBeNull();
    });
  });

  describe("updateBlogBackgroundImage", () => {
    it("背景画像を更新できる", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(blogs)
        .values({
          userId: testUserId,
          title: "Test Blog",
          description: "Test",
          theme: "light",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await updateBlogBackgroundImage(
        inserted.id,
        "https://example.com/image.jpg",
        "image-key-123",
        env,
      );

      expect(result.blog.backgroundImage).toBe("https://example.com/image.jpg");
      expect(result.blog.backgroundImageKey).toBe("image-key-123");
      expect(result.oldKey).toBeNull();
    });

    it("既存の背景画像がある場合、oldKeyを返す", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(blogs)
        .values({
          userId: testUserId,
          title: "Test Blog",
          description: "Test",
          theme: "light",
          backgroundImage: "https://example.com/old.jpg",
          backgroundImageKey: "old-key",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await updateBlogBackgroundImage(
        inserted.id,
        "https://example.com/new.jpg",
        "new-key",
        env,
      );

      expect(result.oldKey).toBe("old-key");
    });
  });

  describe("deleteBlogBackgroundImage", () => {
    it("背景画像を削除できる", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(blogs)
        .values({
          userId: testUserId,
          title: "Test Blog",
          description: "Test",
          theme: "light",
          backgroundImage: "https://example.com/image.jpg",
          backgroundImageKey: "image-key-123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await deleteBlogBackgroundImage(inserted.id, env);

      expect(result.deletedKey).toBe("image-key-123");

      // 削除されたことを確認
      const updated = await db
        .select()
        .from(blogs)
        .where(eq(blogs.id, inserted.id))
        .get();
      expect(updated?.backgroundImage).toBeNull();
      expect(updated?.backgroundImageKey).toBeNull();
    });

    it("存在しないブログIDの場合、エラーをスローする", async () => {
      await expect(deleteBlogBackgroundImage(999, env)).rejects.toThrow(
        "No blog with id '999'",
      );
    });
  });
});
