"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLoading } from "@/contexts/LoadingContext";
import LoadingSpinner from "./common/LoadingSpinner";

export type AuthGuardProps = {
  children: React.ReactNode;
};

/**
 * 認証済みかどうかを判定し、リダイレクト先を変更する
 */
export default function AuthProvider({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const { setIsGlobalLoading } = useLoading();

  useEffect(() => {
    // 認証状態の確認が完了するまで待機
    if (isLoading) {
      setIsGlobalLoading(true);
      return;
    }

    // 認証が必要なページかどうかを判定
    const isCreatePage = pathname === "/post/create";
    const isEditPage = /^\/post\/\d+\/edit$/.test(pathname);
    const isSigninPage = pathname === "/signin";

    // 投稿作成・編集ページで未認証の場合、サインインページにリダイレクト
    if ((isCreatePage || isEditPage) && !user) {
      router.push("/signin");
      return;
    }

    // 認証済みでサインインページにいる場合、トップページにリダイレクト
    if (user && isSigninPage) {
      router.push("/");
      return;
    }

    setLoading(false);
    setIsGlobalLoading(false);
  }, [router, pathname, user, isLoading, setIsGlobalLoading]);

  // ローディング中はスピナーを表示
  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
