"use client";

import { useEffect, useState } from "react";
import { getAllPostsByUserId } from "@/features/PostList/api";
import type { Post } from "@/lib/api";
import { deletePost as deletePostApi } from "./api";

export function usePostListManagement(userId?: string) {
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
      const response = await getAllPostsByUserId(userId, 0);
      setPosts(response.posts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    await deletePostApi(id);
    await fetchPosts();
  };

  return {
    posts,
    isLoading,
    error,
    deletePost,
    refetch: fetchPosts,
  };
}
