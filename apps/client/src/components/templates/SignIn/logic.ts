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

  const emailSignIn = useCallback(
    async (email: string, password: string) => {
      try {
        await apiClient.signIn({ email, password });
        // ログイン成功後、AuthProviderがリダイレクトを処理
        // ページをリロードして認証状態を反映
        window.location.href = "/signin";
        return null; // 成功時はエラーなし
      } catch (error: any) {
        // メール未認証エラーの場合は、メール確認ページへリダイレクト
        if (error?.code === "EMAIL_NOT_VERIFIED") {
          router.push("/verify-email-sent");
          return null;
        }

        // エラーメッセージを返す
        if (error instanceof Error) {
          return error.message;
        } else {
          return "ログインに失敗しました";
        }
      }
    },
    [router],
  );

  return { githubSignIn, emailSignIn };
};
