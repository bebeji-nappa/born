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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>nappa's Blog</title>
        <meta name="description" content="nappa のブログ" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/og`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/og`}
        />
      </Head>
      <PostListTemplate posts={data} />
    </div>
  );
};

export default Posts;
