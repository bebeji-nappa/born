/// <reference types="@cloudflare/vitest-pool-workers" />

declare module "cloudflare:test" {
  interface ProvidedEnv {
    DB: D1Database;
    RESEND_API_KEY: string;
    EMAIL_FROM: string;
    EMAIL_FROM_NAME: string;
  }
}
