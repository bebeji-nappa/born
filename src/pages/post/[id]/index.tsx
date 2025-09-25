import PostDetailTemplate from '@/components/templates/PostDetail';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { skipToken } from '@tanstack/react-query';

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = trpc.getPostById.useQuery(
    id
      ? {
          id: Number(id),
        }
      : skipToken,
  );

  if (!data?.post) {
    return <div>Loading...</div>;
  }

  const { post } = data;

  return <PostDetailTemplate post={post} />;
};

export default PostDetail;
