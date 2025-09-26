import PostDetailTemplate from '@/components/templates/PostDetail';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { skipToken } from '@tanstack/react-query';
import Head from 'next/head';

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

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?title=${encodeURIComponent(post.title)}&user=${encodeURIComponent(JSON.stringify(post.user))}`;

  return (
    <div>
      <Head>
        <title>{post.title}</title>
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <PostDetailTemplate post={post} />
    </div>
  );
};

export default PostDetail;
