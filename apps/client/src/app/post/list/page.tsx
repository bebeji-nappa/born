"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PostListManagement from "@/components/templates/PostListManagement";

export default function PostListPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { posts, isLoading: postsLoading, deletePost } = usePosts(user?.id);
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

  return <PostListManagement posts={posts} onDelete={deletePost} />;
}
