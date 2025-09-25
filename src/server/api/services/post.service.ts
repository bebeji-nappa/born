import { prisma } from '@/utils/prisma';

export const getPostById = async (id: number) => {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  return {
    post,
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
      authorId: userId,
      published: true,
    },
  });
  return {
    newPost,
  };
};
