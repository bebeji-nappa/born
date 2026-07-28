import { randomBytes } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { z } from "zod";
import { emailChangeTokens, getDB, sessions, users as usersTable } from "../db";
import { deleteAllUserSessions } from "../lib/auth";
import { sanitizeScreenName, sanitizeText } from "../lib/sanitize";
import { csrfProtection } from "../middleware/csrf";
import {
  generateEmailChangeVerificationHTML,
  sendEmail,
} from "../services/email.service";
import {
  getAll,
  getAuthUserId,
  getUserbyEmail,
  getUserbyId,
} from "../services/users.service";

type Bindings = {
  DATABASE_URL: string;
  DB: D1Database;
  STORAGE: R2Bucket;
  STORAGE_URL: string;
  NODE_ENV: string;
  API_BASE_URL: string;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
};

const users = new Hono<{ Bindings: Bindings }>();

users.get("/", async (c) => {
  try {
    const result = await getAll(c.env);
    return c.json(result);
  } catch (error) {
    console.error("Users fetch error:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

users.get(
  "/auth-id",
  zValidator("query", z.object({ email: z.string().email() })),
  async (c) => {
    try {
      const { email } = c.req.valid("query");
      const result = await getAuthUserId(email, c.env);
      return c.json(result);
    } catch (_error) {
      return c.json({ error: "Failed to fetch user ID" }, 500);
    }
  },
);

users.get(
  "/by-email",
  zValidator("query", z.object({ email: z.string().email() })),
  async (c) => {
    try {
      const { email } = c.req.valid("query");
      const result = await getUserbyEmail(email, c.env);
      return c.json(result);
    } catch (_error) {
      return c.json({ error: "Failed to fetch user by email" }, 500);
    }
  },
);

users.get(
  "/by-screen-name/:screen_name",
  zValidator("param", z.object({ screen_name: z.string() })),
  async (c) => {
    try {
      const { screen_name } = c.req.valid("param");
      const db = getDB(c.env.DB);
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.screen_name, screen_name))
        .get();
      return c.json({ user: user || null });
    } catch (error) {
      console.error("User fetch by screen name error:", error);
      return c.json({ error: "Failed to fetch user by screen name" }, 500);
    }
  },
);

users.get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const result = await getUserbyId(id, c.env);
      return c.json(result);
    } catch (error) {
      console.error("User fetch error:", error);
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  },
);

// ユーザー情報更新
users.put("/profile", async (c) => {
  try {
    // CSRF保護
    const csrfError = await csrfProtection(c);
    if (csrfError) {
      return csrfError;
    }

    const sessionToken = getCookie(c, "session-token");
    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // セッションからユーザーを取得
    const db = getDB(c.env.DB);
    const result = await db
      .select({ session: sessions, user: usersTable })
      .from(sessions)
      .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .get();

    if (!result?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { name, description } = body;

    // 更新データの準備（サニタイズ）
    const updateData: { name?: string | null; description?: string | null } =
      {};
    if (name !== undefined) {
      updateData.name = sanitizeText(name);
    }
    if (description !== undefined) {
      updateData.description = description;
    }

    // ユーザー情報を更新
    const updatedUser = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, result.user.id))
      .returning()
      .get();

    return c.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        screen_name: updatedUser.screen_name,
        image: updatedUser.image,
        description: updatedUser.description,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ユーザID（screen_name）更新
users.put("/screen-name", async (c) => {
  try {
    // CSRF保護
    const csrfError = await csrfProtection(c);
    if (csrfError) {
      return csrfError;
    }

    const sessionToken = getCookie(c, "session-token");
    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // セッションからユーザーを取得
    const db = getDB(c.env.DB);
    const result = await db
      .select({ session: sessions, user: usersTable })
      .from(sessions)
      .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .get();

    if (!result?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { screen_name } = body;

    if (screen_name === undefined) {
      return c.json({ error: "screen_name is required" }, 400);
    }

    // screen_nameをサニタイズ
    const sanitizedScreenName = sanitizeScreenName(screen_name);

    if (!sanitizedScreenName) {
      return c.json(
        {
          error:
            "Invalid screen_name. Only alphanumeric characters, hyphens, and underscores are allowed.",
        },
        400,
      );
    }

    // ユーザIDを更新
    const updatedUser = await db
      .update(usersTable)
      .set({ screen_name: sanitizedScreenName })
      .where(eq(usersTable.id, result.user.id))
      .returning()
      .get();

    return c.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        screen_name: updatedUser.screen_name,
        image: updatedUser.image,
        description: updatedUser.description,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Screen name update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// アバター画像更新
users.put("/avatar/image", async (c) => {
  try {
    // CSRF保護
    const csrfError = await csrfProtection(c);
    if (csrfError) {
      return csrfError;
    }

    const sessionToken = getCookie(c, "session-token");
    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // セッションからユーザーを取得
    const db = getDB(c.env.DB);
    const result = await db
      .select({ session: sessions, user: usersTable })
      .from(sessions)
      .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .get();

    if (!result?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // ファイルタイプのチェック
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return c.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        400,
      );
    }

    // ファイルサイズのチェック（2MB制限）
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return c.json({ error: "File size exceeds 2MB limit" }, 400);
    }

    // 既存のアバターがあれば削除
    if (result.user.image) {
      try {
        const storageUrl = c.env.STORAGE_URL || "https://storage.born-docs.com";
        const oldKey = result.user.image.replace(`${storageUrl}/`, "");
        await c.env.STORAGE.delete(oldKey);
      } catch (error) {
        console.error("Failed to delete old avatar:", error);
      }
    }

    // ユニークなファイル名を生成
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const key = `avatars/${result.user.id}/${timestamp}.${ext}`;

    // R2にアップロード
    await c.env.STORAGE.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // 公開URLを生成（環境に応じて変更）
    const nodeEnv = c.env.NODE_ENV || "development";
    let storageUrl: string;

    if (nodeEnv === "development") {
      // ローカル開発: APIサーバー経由
      storageUrl = `${c.env.API_BASE_URL || "http://localhost:8000"}/api/users/avatar`;
    } else if (nodeEnv === "staging") {
      // Staging: カスタムドメイン
      storageUrl = c.env.STORAGE_URL || "https://staging-storage.born-docs.com";
    } else {
      // Production: カスタムドメイン
      storageUrl = c.env.STORAGE_URL || "https://storage.born-docs.com";
    }

    const url = `${storageUrl}/${key}`;

    // ユーザーのimageフィールドを更新
    const updatedUser = await db
      .update(usersTable)
      .set({ image: url })
      .where(eq(usersTable.id, result.user.id))
      .returning()
      .get();

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
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Avatar update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// アバター画像配信（ローカル開発用）
users.get("/avatar/:key{.+}", async (c) => {
  try {
    const key = c.req.param("key");
    const object = await c.env.STORAGE.get(key);

    if (!object) {
      return c.json({ error: "Image not found" }, 404);
    }

    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Avatar image fetch error:", error);
    return c.json({ error: "Failed to fetch avatar image" }, 500);
  }
});

// パスワード更新
users.put(
  "/password",
  zValidator(
    "json",
    z.object({
      currentPassword: z.string(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      passwordConfirmation: z.string(),
    }),
  ),
  async (c) => {
    try {
      // CSRF保護
      const csrfError = await csrfProtection(c);
      if (csrfError) {
        return csrfError;
      }

      const sessionToken = getCookie(c, "session-token");
      if (!sessionToken) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // セッションからユーザーを取得
      const db = getDB(c.env.DB);
      const result = await db
        .select({ session: sessions, user: usersTable })
        .from(sessions)
        .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
        .where(eq(sessions.sessionToken, sessionToken))
        .get();

      if (!result?.user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { currentPassword, password, passwordConfirmation } =
        c.req.valid("json");

      // 現在のパスワード確認
      if (!result.user.hash) {
        return c.json({ error: "No password set for this account" }, 400);
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        result.user.hash,
      );
      if (!isPasswordValid) {
        return c.json({ error: "現在のパスワードが正しくありません" }, 400);
      }

      // パスワード確認チェック
      if (password !== passwordConfirmation) {
        return c.json({ error: "Passwords do not match" }, 400);
      }

      // パスワード強度チェック
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
        return c.json(
          {
            error:
              "Password must contain uppercase, lowercase, number, and symbol",
          },
          400,
        );
      }

      // パスワードをハッシュ化
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);

      // ユーザーのhashフィールドを更新
      await db
        .update(usersTable)
        .set({ hash })
        .where(eq(usersTable.id, result.user.id))
        .run();

      // セキュリティ強化: 全セッションを無効化（現在のセッションも含む）
      // パスワード変更後は再認証を必須とするため、新しいセッションは作成しない
      await deleteAllUserSessions(result.user.id, c.env);

      return c.json({
        success: true,
        message:
          "Password updated successfully. Please sign in again with your new password.",
      });
    } catch (error) {
      console.error("Password update error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

// メールアドレス変更の確認待ち状態をチェック
users.get("/email/pending", async (c) => {
  try {
    const sessionToken = getCookie(c, "session-token");
    if (!sessionToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = getDB(c.env.DB);
    const result = await db
      .select({ session: sessions, user: usersTable })
      .from(sessions)
      .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .get();

    if (!result?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // 有効期限内のトークンを検索
    const pendingToken = await db
      .select()
      .from(emailChangeTokens)
      .where(eq(emailChangeTokens.userId, result.user.id))
      .get();

    if (pendingToken && new Date() < new Date(pendingToken.expires)) {
      return c.json({
        pending: true,
        newEmail: pendingToken.newEmail,
        expiresAt: pendingToken.expires,
      });
    }

    // 期限切れトークンがあれば削除
    if (pendingToken) {
      await db
        .delete(emailChangeTokens)
        .where(eq(emailChangeTokens.id, pendingToken.id))
        .run();
    }

    return c.json({ pending: false });
  } catch (error) {
    console.error("Email pending check error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// メールアドレス変更リクエスト
users.post(
  "/email/request",
  zValidator(
    "json",
    z.object({
      newEmail: z.string().email("Invalid email address"),
    }),
  ),
  async (c) => {
    try {
      // CSRF保護
      const csrfError = await csrfProtection(c);
      if (csrfError) {
        return csrfError;
      }

      const sessionToken = getCookie(c, "session-token");
      if (!sessionToken) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // セッションからユーザーを取得
      const db = getDB(c.env.DB);
      const result = await db
        .select({ session: sessions, user: usersTable })
        .from(sessions)
        .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
        .where(eq(sessions.sessionToken, sessionToken))
        .get();

      if (!result?.user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // 有効期限内の確認待ちトークンがあるかチェック
      const existingToken = await db
        .select()
        .from(emailChangeTokens)
        .where(eq(emailChangeTokens.userId, result.user.id))
        .get();

      if (existingToken && new Date() < new Date(existingToken.expires)) {
        return c.json(
          {
            error:
              "既にメールアドレス変更の確認待ち状態です。確認メールをご確認ください。",
          },
          400,
        );
      }

      const { newEmail } = c.req.valid("json");

      // 新しいメールアドレスが既に使用されているかチェック
      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, newEmail))
        .get();

      if (existingUser) {
        return c.json(
          { error: "このメールアドレスは既に使用されています" },
          400,
        );
      }

      // 既存のトークンを削除
      await db
        .delete(emailChangeTokens)
        .where(eq(emailChangeTokens.userId, result.user.id))
        .run();

      // トークン生成
      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1時間

      // トークンをDBに保存
      await db
        .insert(emailChangeTokens)
        .values({
          id: randomBytes(16).toString("hex"),
          userId: result.user.id,
          newEmail,
          token,
          expires,
        })
        .run();

      // 確認メールを送信
      const clientUrl =
        c.env.NODE_ENV === "production"
          ? "https://born-docs.com"
          : c.env.NODE_ENV === "staging"
            ? "https://staging.born-docs.com"
            : "http://localhost:3000";

      const verifyUrl = `${clientUrl}/verify-email-change?token=${token}`;

      // メール送信
      const emailSent = await sendEmail(
        {
          to: newEmail,
          subject: "【Born】メールアドレス変更の確認",
          html: generateEmailChangeVerificationHTML(verifyUrl, newEmail),
        },
        c.env,
      );

      if (!emailSent) {
        console.error("Failed to send email change verification email");
        // メール送信失敗時もトークンは保存済みなので、エラーは返さない
        // 開発環境ではコンソールにURLを出力
        if (c.env.NODE_ENV === "development") {
          console.log(
            `Email change verification URL for ${newEmail}: ${verifyUrl}`,
          );
        }
      }

      return c.json({
        success: true,
        message: "確認メールを送信しました",
      });
    } catch (error) {
      console.error("Email change request error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

// メールアドレス変更確認
users.get(
  "/email/verify",
  zValidator("query", z.object({ token: z.string() })),
  async (c) => {
    try {
      const { token } = c.req.valid("query");

      const db = getDB(c.env.DB);
      const tokenRecord = await db
        .select()
        .from(emailChangeTokens)
        .where(eq(emailChangeTokens.token, token))
        .get();

      if (!tokenRecord) {
        return c.json({ error: "Invalid or expired token" }, 400);
      }

      // トークンの有効期限チェック
      if (new Date() > new Date(tokenRecord.expires)) {
        await db
          .delete(emailChangeTokens)
          .where(eq(emailChangeTokens.id, tokenRecord.id))
          .run();
        return c.json({ error: "Token has expired" }, 400);
      }

      // メールアドレスを更新
      await db
        .update(usersTable)
        .set({ email: tokenRecord.newEmail })
        .where(eq(usersTable.id, tokenRecord.userId))
        .run();

      // トークンを削除
      await db
        .delete(emailChangeTokens)
        .where(eq(emailChangeTokens.id, tokenRecord.id))
        .run();

      return c.json({
        success: true,
        message: "メールアドレスが正常に変更されました",
      });
    } catch (error) {
      console.error("Email change verification error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

export default users;
