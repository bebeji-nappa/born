import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export function getPrismaClient(env: any): PrismaClient {
  if (!env?.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }
  
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  return prisma
}
