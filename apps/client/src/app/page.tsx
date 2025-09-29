"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import PostListTemplate from "@/components/templates/PostList";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { isLoading: authLoading } = useAuth();
  const [userId, setUserId] = useState<string>();
  const { posts, isLoading: postsLoading } = usePosts(userId);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = process.env.NEXT_PUBLIC_EMAIL;
        if (email) {
          // 環境変数が既にエンコードされている場合はデコードする
          const decodedEmail = decodeURIComponent(email);
          console.log("Original email:", email);
          console.log("Decoded email:", decodedEmail);
          const response = await apiClient.getUserByEmail(decodedEmail);
          setUserId(response.user?.id);
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    if (!authLoading) {
      fetchUserId();
    }
  }, [authLoading]);

  if (authLoading || postsLoading || !posts) {
    return <LoadingSpinner />;
  }

  return <PostListTemplate posts={posts} />;
}
