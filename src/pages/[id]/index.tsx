import PostListTemplate from '@/components/templates/PostList';
import { trpc } from '@/utils/trpc';
import { skipToken } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Posts = () => {
  const session = useSession();
  const router = useRouter();

  const { id } = router.query;

  const { data: user } = trpc.getUserbyId.useQuery(
    id
      ? {
          id: String(id),
        }
      : skipToken,
  );

  console.log('user', user);

  const { data } = trpc.getAllPostsByUserId.useQuery(
    user?.user ? { userId: user.user.id } : skipToken,
  );

  if (session.status === 'loading' || !data) {
    return <div>Loading...</div>;
  }

  return <PostListTemplate posts={data} />;
};

export default Posts;
