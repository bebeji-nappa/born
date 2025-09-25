import React, { use } from 'react';
import PostCreateTemplate from '@/components/templates/PostCreate';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';

const PostCreate = () => {
  const { data: session } = useSession();
  const { data } = trpc.getAuthUserId.useQuery({
    email: session?.user?.email ?? '',
  });

  const userId = data?.userId;

  if (!userId) {
    return <div>Loading...</div>;
  }

  return <PostCreateTemplate userId={userId} />;
};

export default PostCreate;
