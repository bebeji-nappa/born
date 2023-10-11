import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";


export type AuthGuardProps = {
  children: React.ReactNode;
};

/** 
 * 認証済みかどうかを判定し、リダイレクト先を変更する
*/
export default function AuthGuardPrivider({ children }: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && router.pathname !== "/signin") {
      router.push("/signin");
    }
    if (status === "authenticated" && router.pathname === "/signin") {
      router.push("/home");
    }
  }, [router, status]);

  return children;
};
