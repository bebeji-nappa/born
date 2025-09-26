import LoadingSpinner from '@/components/common/LoadingSpinner';
import PostListTemplate from '@/components/templates/PostList';
import { trpc } from '@/utils/trpc';
import { skipToken } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

const Posts = () => {
  const session = useSession();
  const { data: user } = trpc.getUserbyEmail.useQuery(
    process.env.NEXT_PUBLIC_EMAIL
      ? {
          email: process.env.NEXT_PUBLIC_EMAIL,
        }
      : skipToken,
  );

  const { data } = trpc.getAllPostsByUserId.useQuery(
    user?.user ? { userId: user.user.id } : skipToken,
  );

  if (session.status === 'loading' || !data) {
    return <LoadingSpinner />;
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og`;

  return (
    <>
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
      <PostListTemplate posts={data} />
    </>
  );
};

export default Posts;
