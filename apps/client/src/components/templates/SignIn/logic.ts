import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";

export const useSignIn = () => {
  const router = useRouter();

  const githubSignIn = useCallback(() => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${apiBaseUrl}/api/auth/signin/github`;
  }, []);

  const emailSignIn = useCallback(async (email: string, password: string) => {
    try {
      await apiClient.signIn({ email, password });

      // ログイン成功後、現在のユーザー情報を取得
      const userData = await apiClient.getCurrentUser();

      // nameがnullの場合は初回ログインとみなす
      if (userData?.user && !userData.user.name) {
        router.push("/account/setting");
      } else {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("ログインに失敗しました");
      }
    }
  }, [router]);

  return { githubSignIn, emailSignIn };
};
