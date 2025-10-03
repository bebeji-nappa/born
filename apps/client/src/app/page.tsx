"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import PostListTemplate from "@/components/templates/PostList";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";

type Blog = {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  backgroundImage: string | null;
  userId: string;
};

export default function HomePage() {
  const { isLoading: authLoading } = useAuth();
  const [userId, setUserId] = useState<string>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const { posts, isLoading: postsLoading } = usePosts(userId, true);

  useEffect(() => {
    const fetchUserAndBlog = async () => {
      try {
        const email = process.env.NEXT_PUBLIC_EMAIL;
        if (email) {
          // 環境変数が既にエンコードされている場合はデコードする
          const decodedEmail = decodeURIComponent(email);
          const response = await apiClient.getUserByEmail(decodedEmail);
          setUserId(response.user?.id);

          // Blogデータも取得
          if (response.user?.id) {
            const blogRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/blogs/user/${response.user.id}`
            );
            const blogData = await blogRes.json();
            setBlog(blogData.blog);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    if (!authLoading) {
      fetchUserAndBlog();
    }
  }, [authLoading]);

  if (authLoading || postsLoading) {
    return <LoadingSpinner />;
  }

  return <PostListTemplate posts={posts} blog={blog} />;
}
