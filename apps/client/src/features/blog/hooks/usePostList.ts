"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/utils/api";
import { getAllPostsByUserId } from "../api";

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export function usePostList(
  userId?: string,
  published?: boolean,
  page: number = 1,
  limit: number = 10,
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchPosts(page, limit);
    }
  }, [userId, page, limit]);

  const fetchPosts = async (
    currentPage: number = 1,
    currentLimit: number = 10,
  ) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await getAllPostsByUserId(
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

  return {
    posts,
    pagination,
    isLoading,
    error,
    refetch: fetchPosts,
  };
}
