import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/opengraph-image`;

  return (
    <Html lang="ja">
      <Head>
        <title>nappa's Blog</title>
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}`}
        />
        <meta property="og:type" content="website" />
        <meta name="description" content="nappa のブログ。" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:title" content="nappa's Blog" />
        <meta name="twitter:description" content="nappa のブログ。" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
