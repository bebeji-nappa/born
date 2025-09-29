import { PrismaClient } from '../../prisma/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate'

export function getPrismaClient(env: any) {
  if (!env?.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }

  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate())

  return prisma
}
