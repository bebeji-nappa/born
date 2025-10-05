import { env } from 'cloudflare:test';
import { beforeAll } from 'vitest';

// テスト開始前にデータベーススキーマを作成
beforeAll(async () => {
  // D1のbatchを使用してスキーマを作成
  const statements = [
    'CREATE TABLE IF NOT EXISTS User (id TEXT PRIMARY KEY, name TEXT, screen_name TEXT, email TEXT UNIQUE, emailVerified TEXT, image TEXT, description TEXT, hash TEXT, github_id TEXT, createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)',
    'CREATE UNIQUE INDEX IF NOT EXISTS User_email_key ON User(email)',
    'CREATE TABLE IF NOT EXISTS Account (id TEXT PRIMARY KEY, userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE, type TEXT NOT NULL, provider TEXT NOT NULL, providerAccountId TEXT NOT NULL, refresh_token TEXT, access_token TEXT, expires_at INTEGER, token_type TEXT, scope TEXT, id_token TEXT, session_state TEXT)',
    'CREATE INDEX IF NOT EXISTS Account_userId_idx ON Account(userId)',
    'CREATE UNIQUE INDEX IF NOT EXISTS Account_provider_providerAccountId_key ON Account(provider, providerAccountId)',
    'CREATE TABLE IF NOT EXISTS Session (id TEXT PRIMARY KEY, sessionToken TEXT NOT NULL UNIQUE, userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE, expires INTEGER NOT NULL)',
    'CREATE INDEX IF NOT EXISTS Session_userId_idx ON Session(userId)',
    'CREATE UNIQUE INDEX IF NOT EXISTS Session_sessionToken_key ON Session(sessionToken)',
    'CREATE TABLE IF NOT EXISTS EmailVerificationToken (id TEXT PRIMARY KEY, userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE, token TEXT NOT NULL UNIQUE, expires INTEGER NOT NULL, createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)',
    'CREATE INDEX IF NOT EXISTS EmailVerificationToken_userId_idx ON EmailVerificationToken(userId)',
    'CREATE UNIQUE INDEX IF NOT EXISTS EmailVerificationToken_token_key ON EmailVerificationToken(token)',
    'CREATE TABLE IF NOT EXISTS RateLimit (key TEXT PRIMARY KEY, requestCount INTEGER NOT NULL DEFAULT 0, windowStart INTEGER NOT NULL, blockedUntil INTEGER, expiresAt INTEGER NOT NULL)',
    'CREATE TABLE IF NOT EXISTS Blog (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, theme TEXT, backgroundImage TEXT, backgroundImageKey TEXT, userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE, createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT NOT NULL)',
    'CREATE INDEX IF NOT EXISTS Blog_userId_idx ON Blog(userId)',
    'CREATE TABLE IF NOT EXISTS Post (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 0, userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE, blogId INTEGER NOT NULL REFERENCES Blog(id) ON DELETE CASCADE, createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT NOT NULL)',
    'CREATE INDEX IF NOT EXISTS Post_userId_idx ON Post(userId)',
    'CREATE INDEX IF NOT EXISTS Post_blogId_idx ON Post(blogId)',
  ];

  await env.DB.batch(statements.map(sql => env.DB.prepare(sql)));

  console.log('✓ Test database schema created successfully');
});
