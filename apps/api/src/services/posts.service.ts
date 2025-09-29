import { getPrismaClient } from '../lib/prisma'

export const getPostById = async (id: number, env: any) => {
  const prisma = getPrismaClient(env)
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  })

  if (!post) {
    throw new Error(`No post with id '${id}'`)
  }

  return {
    post,
  }
}

export const getAllPostsByUserId = async (userId: string, env: any) => {
  const prisma = getPrismaClient(env)
  const posts = await prisma.post.findMany({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return {
    posts,
  }
}

export const updatePostById = async (
  id: number,
  title: string,
  content: string,
  env: any
) => {
  const prisma = getPrismaClient(env)
  const updatedPost = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      content: content,
    },
  })
  return {
    updatedPost,
  }
}

export const deletePostById = async (id: number, env: any) => {
  const prisma = getPrismaClient(env)
  await prisma.post.delete({
    where: {
      id: id,
    },
  })
  return {
    message: 'Post deleted successfully',
  }
}

export const getAllPosts = async (env: any) => {
  const prisma = getPrismaClient(env)
  const posts = await prisma.post.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return {
    posts,
  }
}

export const createPost = async (
  title: string,
  content: string,
  userId: string,
  env: any
) => {
  const prisma = getPrismaClient(env)
  const newPost = await prisma.post.create({
    data: {
      title: title,
      content: content,
      userId: userId,
      published: true,
    },
  })
  return {
    newPost,
  }
}