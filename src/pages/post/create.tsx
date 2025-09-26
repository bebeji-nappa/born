import React, { use } from 'react';
import PostCreateTemplate from '@/components/templates/PostCreate';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const PostCreate = () => {
  const { data: session } = useSession();
  const { data } = trpc.getAuthUserId.useQuery({
    email: session?.user?.email ?? '',
  });

  const userId = data?.userId;

  if (!userId) {
    return <LoadingSpinner />;
  }

  return <PostCreateTemplate userId={userId} />;
};

export default PostCreate;
