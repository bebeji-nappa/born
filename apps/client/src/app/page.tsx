"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import HomeTemplate from "@/components/templates/Home";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.screen_name) {
      // ログイン済みの場合はユーザーのブログページへリダイレクト
      router.push(`/${user.screen_name}`);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 未ログインの場合のみトップページを表示
  if (!user) {
    return <HomeTemplate />;
  }

  return null;
}
