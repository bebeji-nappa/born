import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Account table
export const accounts = sqliteTable(
  "Account",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    userIdIdx: index("Account_userId_idx").on(table.userId),
    providerAccountIdx: uniqueIndex(
      "Account_provider_providerAccountId_key",
    ).on(table.provider, table.providerAccountId),
  }),
);

// Session table
export const sessions = sqliteTable(
  "Session",
  {
    id: text("id").primaryKey(),
    sessionToken: text("sessionToken").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    userIdIdx: index("Session_userId_idx").on(table.userId),
    sessionTokenIdx: uniqueIndex("Session_sessionToken_key").on(
      table.sessionToken,
    ),
  }),
);

// User table
export const users = sqliteTable(
  "User",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    screen_name: text("screen_name"),
    email: text("email").unique(),
    emailVerified: text("emailVerified"),
    image: text("image"),
    description: text("description"),
    hash: text("hash"),
    github_id: text("github_id"),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: uniqueIndex("User_email_key").on(table.email),
  }),
);

// EmailVerificationToken table
export const emailVerificationTokens = sqliteTable(
  "EmailVerificationToken",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index("EmailVerificationToken_userId_idx").on(table.userId),
    tokenIdx: uniqueIndex("EmailVerificationToken_token_key").on(table.token),
  }),
);

// RateLimit table
export const rateLimits = sqliteTable("RateLimit", {
  key: text("key").primaryKey(), // IPアドレス + エンドポイント (例: "192.168.1.1:signup")
  requestCount: integer("requestCount").notNull().default(0),
  windowStart: integer("windowStart").notNull(), // Unix timestamp
  blockedUntil: integer("blockedUntil"), // ブロック解除時刻 (NULLならブロックなし)
  expiresAt: integer("expiresAt").notNull(), // レコード削除用
});

// Blog table
export const blogs = sqliteTable(
  "Blog",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title"),
    description: text("description"),
    theme: text("theme"),
    backgroundImage: text("backgroundImage"),
    backgroundImageKey: text("backgroundImageKey"),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("Blog_userId_idx").on(table.userId),
  }),
);

// Post table
export const posts = sqliteTable(
  "Post",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(false),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    blogId: integer("blogId")
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("Post_userId_idx").on(table.userId),
    blogIdIdx: index("Post_blogId_idx").on(table.blogId),
  }),
);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type EmailVerificationToken =
  typeof emailVerificationTokens.$inferSelect;
export type NewEmailVerificationToken =
  typeof emailVerificationTokens.$inferInsert;
export type RateLimit = typeof rateLimits.$inferSelect;
export type NewRateLimit = typeof rateLimits.$inferInsert;
