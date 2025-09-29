import { prisma } from '../lib/prisma'

export const getAll = async () => {
  const users = await prisma.user.findMany()
  return {
    users,
  }
}

export const getUserbyId = async (id: string) => {
  const data = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  return {
    user: data,
  }
}

export const getUserbyEmail = async (email: string) => {
  const data = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  return {
    user: data,
  }
}

export const getAuthUserId = async (email: string) => {
  const data = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
  return {
    userId: data?.id ?? '',
  }
}