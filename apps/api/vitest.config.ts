import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          // テスト用のD1データベース設定
          d1Databases: ['DB'],
        },
      },
    },
    include: ['src/spec/**/*.spec.ts'],
    setupFiles: ['./src/spec/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/services/**/*.ts', 'src/routes/**/*.ts'],
      exclude: ['src/spec/**'],
    },
  },
});
