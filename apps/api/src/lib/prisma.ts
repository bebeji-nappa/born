import { PrismaClient } from '../../prisma/generated/prisma';
import { PrismaD1 } from '@prisma/adapter-d1';

export function getPrismaClient(env: any) {
  // D1データベースを使用する場合
  if (env?.DB) {
    const adapter = new PrismaD1(env.DB);
    return new PrismaClient({ adapter });
  }

  // フォールバック: DATABASE_URLを使用
  if (!env?.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }

  // 開発環境では通常のPrismaClient、本番環境ではEdge用を使用
  if (env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('../../prisma/generated/prisma');
    return new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('../../prisma/generated/edge');
    return new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    });
  }
}
