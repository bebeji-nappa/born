import { router } from '../trpc';
import { publicProcedure } from '../trpc';
import { z } from 'zod';
import {
  createPostHandler,
  deletePostHandler,
  getAllPostsByUserIdHandler,
  getPostByIdHandler,
  updatePostByIdHandler,
} from '../controllers/post.controller';

export const postRouter = router({
  getPostById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await getPostByIdHandler(input.id);
      return post;
    }),
  getAllPostsByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { posts } = await getAllPostsByUserIdHandler(input.userId);
      return posts;
    }),
  createPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newPost = await createPostHandler(
        input.title,
        input.content,
        input.userId,
      );
      return newPost;
    }),
  updatePostById: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const updatedPost = await updatePostByIdHandler(
        input.id,
        input.title,
        input.content,
      );
      return updatedPost;
    }),
  deletePost: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const result = await deletePostHandler(input.id);
      return result;
    }),
});
