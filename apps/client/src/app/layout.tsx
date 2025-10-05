"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import AuthProvider from "./AuthProvider";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import { ToastProvider } from "@/hooks/useToast";
import "../styles/reset.css";

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isGlobalLoading } = useLoading();
  const isAuthPage = pathname === "/signin" || pathname === "/signup";
  const isHomePage = pathname === "/";
  const isPostEditPage = pathname?.match(/^\/post\/[^/]+\/edit$/);
  const isPostCreatePage = pathname === "/post/create";
  const isBlockedPage = pathname === "/blocked";

  const shouldShowHeader =
    !isAuthPage &&
    !isHomePage &&
    !isPostEditPage &&
    !isPostCreatePage &&
    !isBlockedPage &&
    !isGlobalLoading;

  return (
    <>
      {shouldShowHeader && <PageHeader />}
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ToastProvider>
          <LoadingProvider>
            <LayoutContent>{children}</LayoutContent>
          </LoadingProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
