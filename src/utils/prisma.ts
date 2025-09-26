import { PrismaClient } from '../../prisma/generated/prisma';
// import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// export const prisma = new PrismaClient().$extends(withAccelerate())
export const prisma = new PrismaClient();
