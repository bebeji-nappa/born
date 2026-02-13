import { eq } from "drizzle-orm";
import { type EnvWithDB, getDB, users } from "../db";

export const getAll = async (env: EnvWithDB) => {
  const db = getDB(env.DB);
  const allUsers = await db.select().from(users);
  return {
    users: allUsers,
  };
};

export const getUserbyId = async (id: string, env: EnvWithDB) => {
  const db = getDB(env.DB);
  const data = await db.select().from(users).where(eq(users.id, id)).get();
  return {
    user: data ?? null,
  };
};

export const getUserbyEmail = async (email: string, env: EnvWithDB) => {
  const db = getDB(env.DB);
  const data = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();
  return {
    user: data ?? null,
  };
};

export const getAuthUserId = async (email: string, env: EnvWithDB) => {
  const db = getDB(env.DB);
  const data = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();
  return {
    userId: data?.id ?? "",
  };
};
