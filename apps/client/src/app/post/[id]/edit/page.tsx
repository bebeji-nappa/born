"use client";

import { use } from "react";
import PostEditTemplate from "@/components/templates/PostEdit";
import { usePost } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export const dynamic = "force-dynamic";

export default function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const postId = parseInt(id);
  const { post, isLoading, error } = usePost(postId);
  const { user, isLoading: authLoading } = useAuth();

  if (isLoading || authLoading) return <LoadingSpinner />;
  if (error || !post) return <div>Post not found</div>;
  if (!user) return <div>Unauthorized</div>;

  return (
    <PostEditTemplate id={post.id} title={post.title} content={post.content} />
  );
}
