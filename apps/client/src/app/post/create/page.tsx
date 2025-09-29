"use client";

import PostCreateTemplate from "@/components/templates/PostCreate";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function PostCreatePage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return <PostCreateTemplate userId={user.id} />;
}
