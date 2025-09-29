import { PrismaClient } from '../../prisma/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

export function getPrismaClient(env: any): PrismaClient {
  if (!env?.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }
  
  const pool = new Pool({ connectionString: env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({
    adapter,
  })
}
