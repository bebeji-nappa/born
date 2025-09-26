import {
  createPost,
  updatePostById,
  deletePostById,
  getPostById,
  getAllPostsByUserId,
} from '../services/post.service';

/**
 * @get /api/post/:id
 *
 * @post /api/post
 *
 * @put /api/post/:id
 *
 * @delete /api/post/:id
 *
 */

export const getPostByIdHandler = async (id: number) => await getPostById(id);
export const getAllPostsByUserIdHandler = async (userId: string) =>
  await getAllPostsByUserId(userId);
export const createPostHandler = async (
  title: string,
  content: string,
  userId: string,
) => await createPost(title, content, userId);
export const updatePostByIdHandler = async (
  id: number,
  title: string,
  content: string,
) => await updatePostById(id, title, content);
export const deletePostHandler = async (id: number) => await deletePostById(id);
