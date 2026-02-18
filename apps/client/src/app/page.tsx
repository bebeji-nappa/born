import type { Metadata } from "next";
import Home from "@/features/home/components/views/Home";
import { PageTitle } from "@/features/shared/components/layouts/PageTitle";

export const metadata: Metadata = {
  title: "Born - 自分だけのブログを始めよう",
  description:
    "Bornは誰でも簡単に美しいブログを作成できるプラットフォームです。マークダウンで記事を書き、テーマをカスタマイズして、自分だけのブログを公開しましょう。",
  openGraph: {
    title: "Born - 自分だけのブログを始めよう",
    description:
      "Bornは誰でも簡単に美しいブログを作成できるプラットフォームです。マークダウンで記事を書き、テーマをカスタマイズして、自分だけのブログを公開しましょう。",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Born",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Born - 自分だけのブログを始めよう",
    description:
      "Bornは誰でも簡単に美しいブログを作成できるプラットフォームです。マークダウンで記事を書き、テーマをカスタマイズして、自分だけのブログを公開しましょう。",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  console.log("Client CI テスト");
  return (
    <>
      <PageTitle title="ホーム" />
      <Home />
    </>
  );
}
