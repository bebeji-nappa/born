import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { getDB, users } from "../../db";
import {
  getAll,
  getUserbyId,
  getUserbyEmail,
  getAuthUserId,
} from "../../services/users.service";

describe("Users Service", () => {
  beforeEach(async () => {
    // テストデータのクリーンアップ
    const db = getDB(env.DB);
    await db.delete(users);
  });

  describe("getAll", () => {
    it("全ユーザーを取得できる", async () => {
      const db = getDB(env.DB);

      // テストデータを挿入
      await db.insert(users).values([
        {
          id: "test-user-1",
          email: "test1@example.com",
          name: "Test User 1",
          createdAt: new Date().toISOString(),
        },
        {
          id: "test-user-2",
          email: "test2@example.com",
          name: "Test User 2",
          createdAt: new Date().toISOString(),
        },
      ]);

      const result = await getAll(env);

      expect(result.users).toHaveLength(2);
      expect(result.users[0].email).toBe("test1@example.com");
      expect(result.users[1].email).toBe("test2@example.com");
    });

    it("ユーザーが存在しない場合、空配列を返す", async () => {
      const result = await getAll(env);

      expect(result.users).toHaveLength(0);
    });
  });

  describe("getUserbyId", () => {
    it("指定したIDのユーザーを取得できる", async () => {
      const db = getDB(env.DB);

      await db.insert(users).values({
        id: "test-user-1",
        email: "test@example.com",
        name: "Test User",
        createdAt: new Date().toISOString(),
      });

      const result = await getUserbyId("test-user-1", env);

      expect(result.user).not.toBeNull();
      expect(result.user?.id).toBe("test-user-1");
      expect(result.user?.email).toBe("test@example.com");
    });

    it("存在しないIDの場合、nullを返す", async () => {
      const result = await getUserbyId("non-existent-id", env);

      expect(result.user).toBeNull();
    });
  });

  describe("getUserbyEmail", () => {
    it("指定したメールアドレスのユーザーを取得できる", async () => {
      const db = getDB(env.DB);

      await db.insert(users).values({
        id: "test-user-1",
        email: "test@example.com",
        name: "Test User",
        createdAt: new Date().toISOString(),
      });

      const result = await getUserbyEmail("test@example.com", env);

      expect(result.user).not.toBeNull();
      expect(result.user?.email).toBe("test@example.com");
    });

    it("存在しないメールアドレスの場合、nullを返す", async () => {
      const result = await getUserbyEmail("nonexistent@example.com", env);

      expect(result.user).toBeNull();
    });
  });

  describe("getAuthUserId", () => {
    it("指定したメールアドレスのユーザーIDを取得できる", async () => {
      const db = getDB(env.DB);

      await db.insert(users).values({
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User",
        createdAt: new Date().toISOString(),
      });

      const result = await getAuthUserId("test@example.com", env);

      expect(result.userId).toBe("test-user-id");
    });

    it("存在しないメールアドレスの場合、空文字列を返す", async () => {
      const result = await getAuthUserId("nonexistent@example.com", env);

      expect(result.userId).toBe("");
    });
  });
});
