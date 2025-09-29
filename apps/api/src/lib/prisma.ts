import { PrismaClient } from '../../prisma/generated/prisma'
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | PrismaClientEdge | undefined;
}

export function getPrismaClient(env: any): PrismaClient {
  if (!env?.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }

  const pool = new Pool({ connectionString: env.DATABASE_URL })
  const adapter = new PrismaPg(pool)

  global.prisma = new PrismaClient({
    adapter,
  })
  
  if (env.NODE_ENV === 'production') {
    global.prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    }).$extends(withAccelerate())
  }
  return global.prisma
}
