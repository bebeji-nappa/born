import { PrismaClient } from '../../prisma/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

global.prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') {
  global.prisma.$extends(withAccelerate());
}

export const prisma = global.prisma;
