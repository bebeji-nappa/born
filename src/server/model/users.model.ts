import { prisma } from '@/utils/prisma';

export const getAll = async () => {
  const users = await prisma.user.findMany();
  return {
    users,
  };
}
