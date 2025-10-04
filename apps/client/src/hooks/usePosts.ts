"use client";

import { useState, useEffect } from "react";
import { apiClient, type Post } from "@/lib/api";

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export function usePosts(userId?: string, published?: boolean, page: number = 1, limit: number = 10) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchPosts(page, limit);
    }
  }, [userId, page, limit]);

  const fetchPosts = async (currentPage: number = 1, currentLimit: number = 10) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await apiClient.getAllPostsByUserId(
        userId,
        published ? 1 : 0,
        currentPage,
        currentLimit,
      );
      setPosts(response.posts);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setPosts([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPostById = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await apiClient.getPostById(id);
      setPosts(response.post ? [response.post] : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (
    title: string,
    content: string,
    published: boolean = false,
  ) => {
    try {
      const post = await apiClient.createPost(title, content, published);
      await fetchPosts(); // Refetch posts
      return post.newPost;
    } catch (err) {
      throw err;
    }
  };

  const updatePost = async (
    id: number,
    title: string,
    content: string,
    published: boolean,
  ) => {
    try {
      const post = await apiClient.updatePost(id, title, content, published);
      await fetchPosts(); // Refetch posts
      return post.updatedPost;
    } catch (err) {
      throw err;
    }
  };

  const deletePost = async (id: number) => {
    try {
      await apiClient.deletePost(id);
      await fetchPosts(); // Refetch posts
    } catch (err) {
      throw err;
    }
  };

  return {
    posts,
    pagination,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
}

export function usePost(id: number) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getPostById(id);
      setPost(response.post);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post");
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    post,
    isLoading,
    error,
    refetch: fetchPost,
  };
}
