import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type EnvWithDB = {
  DB: D1Database;
};

export function getDB(d1: D1Database) {
  return drizzle(d1, { schema });
}

export * from "./schema";
