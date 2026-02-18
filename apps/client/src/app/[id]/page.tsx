"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PostList from "@/features/blog/components/views/PostList";
import { usePostList } from "@/features/blog/hooks/usePostList";
import LoadingSpinner from "@/features/shared/components/elements/LoadingSpinner";
import { PageTitle } from "@/features/shared/components/layouts/PageTitle";
import { useAuth } from "@/features/shared/utils/contexts/AuthContext";

type Blog = {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  backgroundImage: string | null;
  userId: string;
};

type User = {
  id: string;
  name: string;
  screen_name: string | null;
};

export default function UserBlogPage() {
  const { isLoading: authLoading } = useAuth();
  const params = useParams();
  const screenName = params.id as string; // params.idはscreen_name
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [page, setPage] = useState(1);
  const {
    posts,
    pagination,
    isLoading: postsLoading,
  } = usePostList(userId || undefined, true, page, 10);

  const fetchUserAndBlog = useCallback(async () => {
    try {
      if (screenName) {
        // screen_nameからuserIdを取得
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/users/by-screen-name/${screenName}`,
        );
        const userData = await userRes.json();

        if (userData.user) {
          setUserId(userData.user.id);
          setUser(userData.user);

          // Blogデータを取得
          const blogRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/blogs/user/${userData.user.id}`,
          );
          const blogData = await blogRes.json();
          setBlog(blogData.blog);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user and blog:", error);
    }
  }, [screenName, setUserId, setBlog, setUser]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserAndBlog();
    }
  }, [authLoading, screenName, fetchUserAndBlog]);

  if (authLoading || postsLoading) {
    return <LoadingSpinner />;
  }

  const pageTitle = blog?.title || (user ? `${user.name}のブログ` : "");

  return (
    <>
      {pageTitle && <PageTitle title={pageTitle} />}
      <PostList
        posts={posts}
        blog={blog}
        pagination={pagination}
        onPageChange={setPage}
      />
    </>
  );
}
