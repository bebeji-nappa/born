"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PageTitle } from "@/components/common/PageTitle";
import PostListManagement from "@/components/features/PostListManagement";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/hooks/usePosts";

export default function PostDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    posts,
    isLoading: postsLoading,
    deletePost,
  } = usePosts(user?.id, false);
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
