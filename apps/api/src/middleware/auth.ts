import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { type AuthUser, getSessionUser } from "../lib/auth";

type Bindings = {
  DATABASE_URL: string;
};

declare module "hono" {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

export async function authMiddleware(
  c: Context<{ Bindings: Bindings }>,
  next: Next,
) {
  const sessionToken = getCookie(c, "session-token");

  if (!sessionToken) {
    return c.json({ error: "Authentication required" }, 401);
  }

  const user = await getSessionUser(sessionToken, c.env);

  if (!user) {
    return c.json({ error: "Invalid session" }, 401);
  }

  c.set("user", user);
  await next();
}

export async function optionalAuthMiddleware(
  c: Context<{ Bindings: Bindings }>,
  next: Next,
) {
  const sessionToken = getCookie(c, "session-token");

  if (sessionToken) {
    const user = await getSessionUser(sessionToken, c.env);
    if (user) {
      c.set("user", user);
    }
  }

  await next();
}
