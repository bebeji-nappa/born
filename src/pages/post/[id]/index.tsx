import PostDetailTemplate from '@/components/templates/PostDetail';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { skipToken } from '@tanstack/react-query';
import Head from 'next/head';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useMemo } from 'react';

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

  const ogImageUrl = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/opengraph-image?title=${encodeURIComponent(data?.post?.title!)}&user=${encodeURIComponent(JSON.stringify(data?.post?.user))}`;
  }, [[data?.post?.title, data?.post?.user]]);

  if (!data?.post) {
    return <LoadingSpinner />;
  }

  const { post } = data;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content="" />
      </Head>
      <PostDetailTemplate post={post} />
    </>
  );
};

export default PostDetail;
