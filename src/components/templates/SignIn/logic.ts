import { useCallback } from "react";
import { signIn } from "next-auth/react";
export const useSignIn = () => {
  const githubSignIn = useCallback(() => {
    signIn("github", { callbackUrl: "/home" });
  }, []);

  return { githubSignIn };
};
