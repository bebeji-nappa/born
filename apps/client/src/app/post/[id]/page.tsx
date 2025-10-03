import { notFound } from "next/navigation";
import { Metadata } from "next";
import PostDetailTemplate from "@/components/templates/PostDetail";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  userId: string;
  blogId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    screen_name: string | null;
    image?: string;
    description?: string | null;
    createdAt: string;
  };
}

interface Blog {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  backgroundImage: string | null;
  userId: string;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      next: { revalidate: 1 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

async function getBlog(id: number): Promise<Blog | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
      next: { revalidate: 1 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const posts = data.posts || [];

    return posts.map((post: Post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch posts for static generation:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: [
        {
          url: `/post/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.slice(0, 160),
      images: [`/post/${id}/opengraph-image`],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post || !post.published) {
    notFound();
  }

  const blog = await getBlog(post.blogId);

  return <PostDetailTemplate post={post} blog={blog} authUserEmail={undefined} />;
}
