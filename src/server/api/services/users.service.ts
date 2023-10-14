import { prisma } from '@/utils/prisma';

export const getAll = async () => {
  const users = await prisma.user.findMany();
  return {
    users,
  };
};

export const getAuthUserId = async (email: string) => {
  const data = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return {
    userId: data?.id,
  };
};
