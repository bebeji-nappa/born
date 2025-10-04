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
  const isAuthPage = pathname === "/signin" || pathname === "/signup";
  const isHomePage = pathname === "/";

  return (
    <html lang="ja">
      <body className={inter.className}>
        {!isAuthPage && !isHomePage && <PageHeader />}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
