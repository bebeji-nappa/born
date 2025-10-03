import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { PageHeader } from "@/components/common/PageHeader";
import "../styles/reset.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "nappa's Blog",
  description: "nappaのブログ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <PageHeader />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
