/// <reference types="@cloudflare/vitest-pool-workers/types" />

declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    RESEND_API_KEY: string;
    EMAIL_FROM: string;
    EMAIL_FROM_NAME: string;
  }
}
