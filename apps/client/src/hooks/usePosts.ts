"use client";

import { useState, useEffect } from "react";
import { apiClient, type Post } from "@/lib/api";

export function usePosts(userId?: string, published?: boolean) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  const fetchPosts = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await apiClient.getAllPostsByUserId(userId, published ? 1 : 0);
      setPosts(response.posts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (title: string, content: string, published: boolean = false) => {
    try {
      await apiClient.createPost(title, content, published);
      await fetchPosts(); // Refetch posts
    } catch (err) {
      throw err;
    }
  };

  const updatePost = async (id: number, title: string, content: string, published: boolean) => {
    try {
      await apiClient.updatePost(id, title, content, published);
      await fetchPosts(); // Refetch posts
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
