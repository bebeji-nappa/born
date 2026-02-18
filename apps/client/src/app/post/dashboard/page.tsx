"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/elements/LoadingSpinner";
import { PageTitle } from "@/components/layouts/PageTitle";
import PostListManagement from "@/features/post/components/views/PostListManagement";
import { usePostListManagement } from "@/features/post/hooks/usePostListManagement";
import { useAuth } from "@/utils/contexts/AuthContext";

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
