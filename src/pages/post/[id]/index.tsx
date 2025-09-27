import PostDetailTemplate from '@/components/templates/PostDetail';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { skipToken } from '@tanstack/react-query';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useSession } from 'next-auth/react';

const PostDetail = () => {
  const router = useRouter();
  const session = useSession();
  const { id } = router.query;

  const { data, error } = trpc.getPostById.useQuery(
    id
      ? {
          id: Number(id),
        }
      : skipToken,
  );

  if (error) {
    if (error.data?.httpStatus === 404) {
      router.replace('/404');
    }
  }

  if (!data?.post) {
    return <LoadingSpinner />;
  }

  const { post } = data;

  return (
    <PostDetailTemplate post={post} authUserEmail={session.data?.user?.email} />
  );
};

export default PostDetail;
