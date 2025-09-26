import { PrismaClient } from '../../prisma/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient = new PrismaClient();

export const prisma =
  process.env.NODE_ENV === 'production'
    ? prismaClient.$extends(withAccelerate())
    : prismaClient;
