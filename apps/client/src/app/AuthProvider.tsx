"use client";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  AuthProvider as AuthContextProvider,
  useAuth,
} from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";

export type AuthGuardProps = {
  children: React.ReactNode;
};

function AuthGuard({ children }: AuthGuardProps) {
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
    const isProfileSetupPage = pathname === "/setup/profile";

    // 投稿作成・編集ページで未認証の場合、サインインページにリダイレクト
    if ((isCreatePage || isEditPage) && !user) {
      router.push("/signin");
      return;
    } else if (user && isSigninPage) {
      // 初回ログイン（nameがnull）の場合はプロフィール設定へ
      if (!user.name) {
        router.push("/setup/profile");
      } else {
        router.push(`/${user.screen_name}`);
      }
      return;
    }

    // ログイン済みでnameがnullの場合、プロフィール登録ページへリダイレクト
    // ただし、すでにプロフィール登録ページにいる場合は除外
    if (user && !user.name && !isProfileSetupPage) {
      router.push("/setup/profile");
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

export default function AuthProvider({ children }: AuthGuardProps) {
  return (
    <AuthContextProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthContextProvider>
  );
}
