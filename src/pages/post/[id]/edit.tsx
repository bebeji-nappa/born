import React from 'react';
import PostEditTemplate from '@/components/templates/PostEdit';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';

const PostEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = trpc.getPostById.useQuery({
    id: Number(id),
  });

  if (!data?.post) {
    return <div>Loading...</div>;
  }

  const { post } = data;

  return (
    <PostEditTemplate id={post.id} title={post.title} content={post.content} />
  );
};

export default PostEdit;
