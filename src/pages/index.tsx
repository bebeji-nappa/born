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

  return <PostListTemplate posts={data} />;
};

export default Posts;
