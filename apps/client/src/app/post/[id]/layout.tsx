import { Metadata } from "next";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Post = {
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
    image?: string;
  };
};

async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      next: { revalidate: 60 },
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

  const title = post.title;
  const description = post.content.substring(0, 160);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const ogImageUrl = `${baseUrl}/post/${id}/opengraph-image`;

  return {
    title: `${title} | Born`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
