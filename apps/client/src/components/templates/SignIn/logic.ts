import { useCallback } from "react";

export const useSignIn = () => {
  const githubSignIn = useCallback(() => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${apiBaseUrl}/api/auth/signin/github`;
  }, []);

  return { githubSignIn };
};
