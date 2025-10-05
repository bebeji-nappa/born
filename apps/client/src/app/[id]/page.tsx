"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import PostListTemplate from "@/components/templates/PostList";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";

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
  } = usePosts(userId || undefined, true, page, 10);

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

  console.log("UserBlogPage user:", user);
  console.log("UserBlogPage blog:", blog);
  console.log("UserBlogPage posts:", posts);

  return (
    <>
      {pageTitle && <PageTitle title={pageTitle} />}
      <PostListTemplate
        posts={posts}
        blog={blog}
        pagination={pagination}
        onPageChange={setPage}
      />
    </>
  );
}
