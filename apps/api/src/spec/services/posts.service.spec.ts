import { env } from "cloudflare:test";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { blogs, getDB, posts, users } from "../../db";
import {
  createPost,
  deletePostById,
  getAllPosts,
  getAllPostsByUserId,
  getPostById,
  updatePostById,
} from "../../services/posts.service";

describe("Posts Service", () => {
  const testUserId = "test-user-1";
  let testBlogId: number;

  beforeEach(async () => {
    const db = getDB(env.DB);

    // テストデータのクリーンアップ
    await db.delete(posts);
    await db.delete(blogs);
    await db.delete(users);

    // テストユーザーを作成
    await db.insert(users).values({
      id: testUserId,
      email: "test@example.com",
      name: "Test User",
      screen_name: "testuser",
      createdAt: new Date().toISOString(),
    });

    // テストブログを作成
    const blog = await db
      .insert(blogs)
      .values({
        userId: testUserId,
        title: "Test Blog",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning()
      .get();

    testBlogId = blog.id;
  });

  describe("getPostById", () => {
    it("指定したIDの投稿を取得できる", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(posts)
        .values({
          title: "Test Post",
          content: "Test Content",
          userId: testUserId,
          blogId: testBlogId,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await getPostById(inserted.id, env);

      expect(result.post.title).toBe("Test Post");
      expect(result.post.content).toBe("Test Content");
      expect(result.post.user.email).toBe("test@example.com");
    });

    it("存在しないIDの場合、エラーをスローする", async () => {
      await expect(getPostById(999, env)).rejects.toThrow(
        "No post with id '999'",
      );
    });
  });

  describe("getAllPostsByUserId", () => {
    it("指定したユーザーIDの投稿を全て取得できる", async () => {
      const db = getDB(env.DB);

      await db.insert(posts).values([
        {
          title: "Post 1",
          content: "Content 1",
          userId: testUserId,
          blogId: testBlogId,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          title: "Post 2",
          content: "Content 2",
          userId: testUserId,
          blogId: testBlogId,
          published: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      const result = await getAllPostsByUserId(testUserId, undefined, env);

      expect(result.posts).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it("公開済みの投稿のみを取得できる", async () => {
      const db = getDB(env.DB);

      await db.insert(posts).values([
        {
          title: "Published Post",
          content: "Content",
          userId: testUserId,
          blogId: testBlogId,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          title: "Draft Post",
          content: "Content",
          userId: testUserId,
          blogId: testBlogId,
          published: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      const result = await getAllPostsByUserId(testUserId, true, env);

      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].title).toBe("Published Post");
    });

    it("ページネーションが正しく動作する", async () => {
      const db = getDB(env.DB);

      // 15件の投稿を作成
      for (let i = 1; i <= 15; i++) {
        await db.insert(posts).values({
          title: `Post ${i}`,
          content: `Content ${i}`,
          userId: testUserId,
          blogId: testBlogId,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      const page1 = await getAllPostsByUserId(
        testUserId,
        undefined,
        env,
        1,
        10,
      );
      const page2 = await getAllPostsByUserId(
        testUserId,
        undefined,
        env,
        2,
        10,
      );

      expect(page1.posts).toHaveLength(10);
      expect(page2.posts).toHaveLength(5);
      expect(page1.pagination.totalPages).toBe(2);
      expect(page1.pagination.hasNext).toBe(true);
      expect(page2.pagination.hasNext).toBe(false);
    });
  });

  describe("createPost", () => {
    it("新しい投稿を作成できる", async () => {
      const result = await createPost(
        "New Post",
        "New Content",
        testUserId,
        true,
        env,
      );

      expect(result.newPost.title).toBe("New Post");
      expect(result.newPost.content).toBe("New Content");
      expect(result.newPost.published).toBe(true);
    });

    it("ブログが存在しないユーザーの場合、エラーをスローする", async () => {
      await expect(
        createPost("Title", "Content", "non-existent-user", true, env),
      ).rejects.toThrow("Blog not found for user");
    });
  });

  describe("updatePostById", () => {
    it("投稿を更新できる", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(posts)
        .values({
          title: "Original Title",
          content: "Original Content",
          userId: testUserId,
          blogId: testBlogId,
          published: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await updatePostById(
        inserted.id,
        "Updated Title",
        "Updated Content",
        true,
        env,
      );

      expect(result.updatedPost.title).toBe("Updated Title");
      expect(result.updatedPost.content).toBe("Updated Content");
      expect(result.updatedPost.published).toBe(true);
    });
  });

  describe("deletePostById", () => {
    it("投稿を削除できる", async () => {
      const db = getDB(env.DB);

      const inserted = await db
        .insert(posts)
        .values({
          title: "Post to Delete",
          content: "Content",
          userId: testUserId,
          blogId: testBlogId,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()
        .get();

      const result = await deletePostById(inserted.id, env);

      expect(result.message).toBe("Post deleted successfully");

      // 削除されたことを確認
      const deleted = await db
        .select()
        .from(posts)
        .where(eq(posts.id, inserted.id))
        .get();
      expect(deleted).toBeUndefined();
    });
  });

  describe("getAllPosts", () => {
    it("指定したユーザーIDと公開状態で投稿を取得できる", async () => {
      const db = getDB(env.DB);

      await db.insert(posts).values([
        {
          title: "Published Post 1",
          content: "Content",
          userId: testUserId,
          blogId: testBlogId,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          title: "Published Post 2",
          content: "Content",
          userId: testUserId,
          blogId: testBlogId,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          title: "Draft Post",
          content: "Content",
          userId: testUserId,
          blogId: testBlogId,
          published: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      const result = await getAllPosts(env, testUserId, true);

      expect(result.posts).toHaveLength(2);
      expect(result.posts.every((p) => p.published)).toBe(true);
    });
  });
});
