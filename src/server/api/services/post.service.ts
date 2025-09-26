import { prisma } from '@/utils/prisma';

export const getPostById = async (id: number) => {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });
  return {
    post,
  };
};

export const getAllPostsByUserId = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return {
    posts,
  };
};

export const updatePostById = async (
  id: number,
  title: string,
  content: string,
) => {
  const updatedPost = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      content: content,
    },
  });
  return {
    updatedPost,
  };
};

export const deletePostById = async (id: number) => {
  await prisma.post.delete({
    where: {
      id: id,
    },
  });
  return {
    message: 'Post deleted successfully',
  };
};

export const createPost = async (
  title: string,
  content: string,
  userId: string,
) => {
  const newPost = await prisma.post.create({
    data: {
      title: title,
      content: content,
      userId: userId,
      published: true,
    },
  });
  return {
    newPost,
  };
};
