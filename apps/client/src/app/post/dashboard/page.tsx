"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PageTitle } from "@/components/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import PostListManagement from "@/features/PostListManagement";
import { usePostListManagement } from "@/features/PostListManagement/usePostListManagement";

export default function PostDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    posts,
    isLoading: postsLoading,
    deletePost,
  } = usePostListManagement(user?.id);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
    }
  }, [user, authLoading, router]);

  if (authLoading || postsLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <PageTitle title="投稿一覧" />
      <PostListManagement posts={posts} onDelete={deletePost} />
    </>
  );
}
