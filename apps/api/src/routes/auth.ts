import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import {
  createSession,
  getSessionUser,
  deleteSession,
  getGitHubOAuthConfig,
  refreshSession,
  type AuthUser,
} from "../lib/auth";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, lt } from "drizzle-orm";
import {
  getDB,
  users,
  accounts,
  blogs,
  emailVerificationTokens,
  rateLimits,
} from "../db";
import * as bcrypt from "bcryptjs";
import {
  sendEmail,
  generateVerificationEmailHTML,
} from "../services/email.service";
import { isValidEmail, sanitizeText } from "../lib/sanitize";
import { rateLimitMiddleware } from "../middleware/rateLimit";
import { generateCsrfToken } from "../lib/csrf";
import { csrfProtection } from "../middleware/csrf";

// Cookie domain helper - クライアントとAPIが異なるサブドメインの場合に対応
function getCookieDomain(nodeEnv?: string): string | undefined {
  if (nodeEnv === "production") {
    return ".born-docs.com";
  } else if (nodeEnv === "staging") {
    return ".born-docs.com";
  }
  // ローカル開発環境ではdomainを指定しない
  return undefined;
}

type Bindings = {
  DB: D1Database;
  AUTH_GITHUB_ID: string;
  AUTH_GITHUB_SECRET: string;
  API_BASE_URL: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
};

type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
};

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

const auth = new Hono<{ Bindings: Bindings }>();

auth.get("/signin/github", async (c) => {
  const config = getGitHubOAuthConfig(c.env);
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=${Math.random().toString(36)}`;

  return c.redirect(authUrl);
});

auth.get("/callback/github", async (c) => {
  try {
    const config = getGitHubOAuthConfig(c.env);
    const db = getDB(c.env.DB);
    const code = c.req.query("code");
    const state = c.req.query("state");

    if (!code) {
      return c.json({ error: "Authorization code not found" }, 400);
    }

    // stateに"connect:"プレフィックスがある場合は連携モード
    const isConnectMode = state?.startsWith("connect:");
    const connectSessionToken = isConnectMode
      ? state?.replace("connect:", "")
      : null;

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: code,
          redirect_uri: config.redirectUri,
        }),
      },
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(
        "GitHub token response error:",
        tokenResponse.status,
        errorText,
      );
      return c.json({ error: "Failed to get access token from GitHub" }, 400);
    }

    const tokenText = await tokenResponse.text();

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (error) {
      console.error(
        "Failed to parse GitHub token response as JSON:",
        tokenText,
      );
      return c.json({ error: "Invalid response from GitHub" }, 400);
    }

    if (!tokenData.access_token) {
      return c.json({ error: "Failed to get access token" }, 400);
    }

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Born-API/1.0",
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error("GitHub user API error:", userResponse.status, errorText);
      return c.json({ error: "Failed to get user from GitHub" }, 400);
    }

    const githubUser = (await userResponse.json()) as GitHubUser;

    // 連携モードの場合
    if (isConnectMode && connectSessionToken) {
      const sessionUser = await getSessionUser(connectSessionToken, c.env);
      if (!sessionUser) {
        return c.json({ error: "Invalid session" }, 401);
      }

      // github_idを更新
      await db
        .update(users)
        .set({ github_id: githubUser.login.toString() })
        .where(eq(users.id, sessionUser.id))
        .run();

      const frontendUrl = c.env.FRONTEND_URL || "http://localhost:3000";
      return c.redirect(`${frontendUrl}/setting/account?github_connected=true`);
    }

    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Born-API/1.0",
      },
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("GitHub email API error:", emailResponse.status, errorText);
      return c.json({ error: "Failed to get emails from GitHub" }, 400);
    }

    const emails = (await emailResponse.json()) as GitHubEmail[];
    const primaryEmail =
      emails.find((email) => email.primary)?.email || githubUser.email;

    if (!primaryEmail) {
      return c.json({ error: "Email not found" }, 400);
    }

    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, primaryEmail))
      .get();

    if (!user) {
      const userId = createId();
      const newUser = await db
        .insert(users)
        .values({
          id: userId,
          email: primaryEmail,
          name: githubUser.name || githubUser.login,
          image: githubUser.avatar_url,
          screen_name: userId,
          github_id: githubUser.login.toString(),
          createdAt: new Date().toISOString(),
        })
        .returning()
        .get();

      user = newUser;

      // ユーザー登録時にBlogを作成
      await db
        .insert(blogs)
        .values({
          userId: user.id,
          title: null,
          description: null,
          theme: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .run();
    } else {
      // 既存ユーザーの場合、github_idがなければ追加
      const updateData: any = {
        name: user.name || githubUser.name,
        image: githubUser.avatar_url,
      };

      if (!user.github_id) {
        updateData.github_id = githubUser.login.toString();
      }

      const updatedUser = await db
        .update(users)
        .set(updateData)
        .where(eq(users.email, primaryEmail))
        .returning()
        .get();

      user = updatedUser;
    }

    // Check if GitHub account already exists
    let account = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, "github"),
          eq(accounts.providerAccountId, githubUser.id.toString()),
        ),
      )
      .get();

    if (!account) {
      await db.insert(accounts).values({
        id: createId(),
        userId: user.id,
        type: "oauth",
        provider: "github",
        providerAccountId: githubUser.id.toString(),
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      });
    } else {
      // Update access token
      await db
        .update(accounts)
        .set({
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
        })
        .where(eq(accounts.id, account.id));
    }

    // ログイン成功時、レート制限をリセット
    const loginIp =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for") ||
      c.req.header("x-real-ip") ||
      "unknown";
    const loginRateLimitKey = `${loginIp}:signin`;
    await db
      .delete(rateLimits)
      .where(eq(rateLimits.key, loginRateLimitKey))
      .run();

    const sessionToken = await createSession(user.id, c.env);

    const cookieDomain = getCookieDomain(c.env.NODE_ENV);
    setCookie(c, "session-token", sessionToken, {
      httpOnly: true,
      secure: true, // Always secure in Workers
      sameSite: c.env.NODE_ENV === "development" ? "lax" : "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain: cookieDomain,
    });

    const frontendUrl = c.env.FRONTEND_URL || "http://localhost:3000";
    // ユーザーのブログページにリダイレクト
    return c.redirect(`${frontendUrl}/${user.screen_name || user.id}`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

auth.post("/signout", async (c) => {
  // CSRF保護
  const csrfError = await csrfProtection(c);
  if (csrfError) {
    return csrfError;
  }

  const sessionToken = getCookie(c, "session-token");

  if (sessionToken) {
    await deleteSession(sessionToken, c.env);
  }

  const cookieDomain = getCookieDomain(c.env.NODE_ENV);
  deleteCookie(c, "session-token", {
    domain: cookieDomain,
    path: "/",
    secure: true,
    sameSite: c.env.NODE_ENV === "development" ? "lax" : "none",
  });
  deleteCookie(c, "csrf-token", {
    domain: cookieDomain,
    path: "/",
    secure: true,
    sameSite: c.env.NODE_ENV === "development" ? "lax" : "none",
  });
  return c.json({ message: "Signed out successfully" });
});

auth.get("/current_user", async (c) => {
  const sessionToken = getCookie(c, "session-token");

  if (!sessionToken) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  let user = await getSessionUser(sessionToken, c.env);

  if (!user) {
    return c.json({ error: "Invalid session" }, 401);
  }

  // If screen_name is null, set it to user.id
  if (!user.screen_name) {
    const db = getDB(c.env.DB);
    const updatedUser = await db
      .update(users)
      .set({ screen_name: user.id })
      .where(eq(users.id, user.id))
      .returning()
      .get();

    user = {
      ...user,
      screen_name: updatedUser.screen_name,
    };
  }

  // セッションの有効期限を延長（アクティブユーザーの維持）
  await refreshSession(sessionToken, c.env);

  return c.json({ user });
});

// ログイン
auth.post(
  "/signin",
  zValidator(
    "json",
    z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
    }),
  ),
  async (c) => {
    try {
      // レート制限チェック
      const rateLimitResponse = await rateLimitMiddleware(c, "signin");
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      const { email, password } = c.req.valid("json");

      // 追加のメールアドレス検証
      if (!isValidEmail(email)) {
        return c.json({ error: "Invalid email address" }, 400);
      }

      const db = getDB(c.env.DB);

      // ユーザーの存在確認
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
      if (!user || !user.hash) {
        return c.json({ error: "Invalid email or password" }, 401);
      }

      // パスワード検証
      const isPasswordValid = await bcrypt.compare(password, user.hash);
      if (!isPasswordValid) {
        return c.json({ error: "Invalid email or password" }, 401);
      }

      // メールアドレス確認チェック（開発環境ではスキップ）
      const isDevEnvironment =
        c.env.NODE_ENV === "development" || !c.env.NODE_ENV;
      if (!user.emailVerified && !isDevEnvironment) {
        return c.json(
          {
            error: "Email not verified",
            code: "EMAIL_NOT_VERIFIED",
            message: "Please verify your email address before signing in",
          },
          403,
        );
      }

      // ログイン成功時、レート制限をリセット
      const ip =
        c.req.header("cf-connecting-ip") ||
        c.req.header("x-forwarded-for") ||
        c.req.header("x-real-ip") ||
        "unknown";
      const rateLimitKey = `${ip}:signin`;
      await db.delete(rateLimits).where(eq(rateLimits.key, rateLimitKey)).run();

      // セッション作成
      const sessionToken = await createSession(user.id, c.env);

      const cookieDomain = getCookieDomain(c.env.NODE_ENV);
      setCookie(c, "session-token", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: c.env.NODE_ENV === "development" ? "lax" : "none",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        domain: cookieDomain,
      });

      // CSRFトークン生成
      const csrfToken = generateCsrfToken();
      setCookie(c, "csrf-token", csrfToken, {
        httpOnly: false, // フロントエンドから読み取れるように
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return c.json({
        success: true,
        message: "Signed in successfully",
        csrfToken, // フロントエンドで保存用
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Sign in error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

// GitHub連携用エンドポイント
auth.get("/connect/github", async (c) => {
  const sessionToken = getCookie(c, "session-token");
  if (!sessionToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const config = getGitHubOAuthConfig(c.env);
  // stateにconnect:プレフィックスを付けて連携モードを示す
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=connect:${sessionToken}`;

  return c.redirect(authUrl);
});

// メールアドレス確認
auth.get("/verify-email", async (c) => {
  try {
    // レート制限チェック
    const rateLimitResponse = await rateLimitMiddleware(c, "verify-email");
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const token = c.req.query("token");

    if (!token) {
      return c.json({ error: "Verification token is required" }, 400);
    }

    const db = getDB(c.env.DB);
    const isDevEnvironment =
      c.env.NODE_ENV === "development" || !c.env.NODE_ENV;

    // 開発環境の場合、トークンチェックをスキップして直接確認済みにする
    if (isDevEnvironment) {
      // トークンに紐づくユーザーを取得（存在確認のみ）
      const verificationToken = await db
        .select()
        .from(emailVerificationTokens)
        .where(eq(emailVerificationTokens.token, token))
        .get();

      if (!verificationToken) {
        return c.json({ error: "Invalid verification token" }, 400);
      }

      // ユーザーのメールアドレスを確認済みにする
      await db
        .update(users)
        .set({ emailVerified: new Date().toISOString() })
        .where(eq(users.id, verificationToken.userId))
        .run();

      // 使用済みトークンを削除
      await db
        .delete(emailVerificationTokens)
        .where(eq(emailVerificationTokens.token, token))
        .run();

      return c.json({
        success: true,
        message: "Email verified successfully (dev mode)",
      });
    }

    // 本番環境: 通常のトークン検証フロー
    // トークンの検証
    const verificationToken = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token))
      .get();

    if (!verificationToken) {
      return c.json({ error: "Invalid verification token" }, 400);
    }

    // トークンの有効期限チェック
    const now = new Date();
    if (verificationToken.expires < now) {
      // 期限切れトークンを削除
      await db
        .delete(emailVerificationTokens)
        .where(eq(emailVerificationTokens.token, token))
        .run();

      return c.json({ error: "Verification token has expired" }, 400);
    }

    // ユーザーのメールアドレスを確認済みにする
    await db
      .update(users)
      .set({ emailVerified: new Date().toISOString() })
      .where(eq(users.id, verificationToken.userId))
      .run();

    // 使用済みトークンを削除
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token))
      .run();

    return c.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// 新規登録
auth.post(
  "/signup",
  zValidator(
    "json",
    z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      passwordConfirmation: z.string(),
    }),
  ),
  async (c) => {
    try {
      // レート制限チェック
      const rateLimitResponse = await rateLimitMiddleware(c, "signup");
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      const { email, password, passwordConfirmation } = c.req.valid("json");

      // 追加のメールアドレス検証
      if (!isValidEmail(email)) {
        return c.json({ error: "Invalid email address" }, 400);
      }

      // パスワード確認チェック
      if (password !== passwordConfirmation) {
        return c.json({ error: "Passwords do not match" }, 400);
      }

      // パスワード強度チェック
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
        return c.json(
          {
            error:
              "Password must contain uppercase, lowercase, number, and symbol",
          },
          400,
        );
      }

      const db = getDB(c.env.DB);

      // メールアドレスの重複チェック
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
      if (existingUser) {
        // 既にAccountが作成されているかチェック
        const existingAccount = await db
          .select()
          .from(accounts)
          .where(
            and(
              eq(accounts.userId, existingUser.id),
              eq(accounts.provider, "email"),
            ),
          )
          .get();

        if (existingAccount) {
          return c.json(
            { error: "Account already exists with this email" },
            400,
          );
        }

        return c.json({ error: "Email already exists" }, 400);
      }

      // パスワードをハッシュ化
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);

      // ユーザー作成（メール未確認状態）
      const userId = createId();
      const newUser = await db
        .insert(users)
        .values({
          id: userId,
          email,
          name: null,
          hash,
          screen_name: userId,
          emailVerified: null, // メール未確認
          createdAt: new Date().toISOString(),
        })
        .returning()
        .get();

      // ユーザー登録時にBlogを作成
      await db
        .insert(blogs)
        .values({
          userId: newUser.id,
          title: null,
          description: null,
          theme: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .run();

      // Email/Password用のAccountレコードを作成
      await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: newUser.id,
          type: "credentials",
          provider: "email",
          providerAccountId: email, // emailをproviderAccountIdとして使用
        })
        .run();

      // メール確認トークン生成
      const verificationToken = createId();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24時間有効

      await db
        .insert(emailVerificationTokens)
        .values({
          id: createId(),
          userId: newUser.id,
          token: verificationToken,
          expires: expiresAt,
          createdAt: new Date().toISOString(),
        })
        .run();

      // 確認メール送信
      const frontendUrl = c.env.FRONTEND_URL || "http://localhost:3000";
      const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
      const emailHTML = generateVerificationEmailHTML(verificationUrl);

      const emailSent = await sendEmail(
        {
          to: email,
          subject: "メールアドレスの確認 - Born",
          html: emailHTML,
        },
        c.env,
      );

      if (!emailSent) {
        console.error("Failed to send verification email to:", email);
        // メール送信失敗してもユーザー登録は成功とする
      }

      // CSRFトークン生成（サインアップ後も認証状態になる場合に備えて）
      const csrfToken = generateCsrfToken();
      setCookie(c, "csrf-token", csrfToken, {
        httpOnly: false, // フロントエンドから読み取れるように
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return c.json({
        success: true,
        message:
          "User created successfully. Please check your email to verify your account.",
        csrfToken, // フロントエンドで保存用
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      });
    } catch (error) {
      console.error("Sign up error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

// レート制限状態確認
auth.get("/rate-limit-status", async (c) => {
  try {
    const db = getDB(c.env.DB);
    const ip =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for") ||
      c.req.header("x-real-ip") ||
      "unknown";

    const key = `${ip}:signin`;
    const now = Date.now();

    const { rateLimits } = await import("../db");

    const rateLimit = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.key, key))
      .get();

    // ブロックされているかチェック
    if (rateLimit?.blockedUntil && rateLimit.blockedUntil > now) {
      const remainingMinutes = Math.ceil(
        (rateLimit.blockedUntil - now) / 60000,
      );
      return c.json({
        blocked: true,
        retryAfter: remainingMinutes,
      });
    }

    // ブロックされていない
    return c.json({
      blocked: false,
      retryAfter: 0,
    });
  } catch (error) {
    console.error("Rate limit status check error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default auth;
