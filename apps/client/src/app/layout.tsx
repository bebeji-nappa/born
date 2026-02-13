"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import { ToastProvider } from "@/hooks/useToast";
import AuthProvider from "./AuthProvider";
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
  const isVerifyEmailPage =
    pathname === "/verify-email-sent" ||
    pathname === "/verify-email" ||
    pathname === "/verify-email-change";
  const isForgotPasswordPage =
    pathname === "/forgot-password" || pathname === "/forgot-password/sent";
  const isResetPasswordPage =
    pathname?.match(/^\/reset-password\/[^/]+$/) ||
    pathname === "/reset-password/success";

  const shouldShowHeader =
    !isAuthPage &&
    !isHomePage &&
    !isPostEditPage &&
    !isPostCreatePage &&
    !isBlockedPage &&
    !isVerifyEmailPage &&
    !isForgotPasswordPage &&
    !isResetPasswordPage &&
    !isGlobalLoading;

  return (
    <AuthProvider>
      {shouldShowHeader && <PageHeader />}
      {children}
    </AuthProvider>
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
