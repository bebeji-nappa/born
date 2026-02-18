"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/features/shared/utils/api";
import { getPostById } from "../api/detail";

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
      const response = await getPostById(id);
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
