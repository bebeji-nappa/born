"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import AuthProvider from "@/components/AuthProvider";
import { PageHeader } from "@/components/common/PageHeader";
import "../styles/reset.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignInPage = pathname === "/signin";

  return (
    <html lang="ja">
      <body className={inter.className}>
        {!isSignInPage && <PageHeader />}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
