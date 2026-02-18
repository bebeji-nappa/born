"use client";

import { use, useEffect, useState } from "react";
import LoadingSpinner from "@/components/elements/LoadingSpinner";
import { PageTitle } from "@/components/layouts/PageTitle";
import { getPostById } from "@/features/post/api/detail";
import PostDetail from "@/features/post/components/PostDetail";
import type { Post } from "@/utils/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const dynamic = "force-dynamic";

interface Blog {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  backgroundImage: string | null;
  userId: string;
}

interface ExtendedPost extends Post {
  blogId: number;
}

async function getBlog(userId: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/user/${userId}`, {
      cache: "no-store",
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

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const postId = parseInt(id);
  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await getPostById(postId);
      if (response.post) {
        setPost(response.post as ExtendedPost);
        setError(null);

        // ブログ情報を取得
        const blogData = await getBlog(response.post.userId);
        setBlog(blogData);
      } else {
        setError("Post not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // ページに戻ってきた時に最新データを取得
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPost();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [postId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return <div>Post not found</div>;
  }

  if (!post.published) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <PageTitle title={post.title} />
      <PostDetail
        post={{
          ...post,
          createdAt:
            typeof post.createdAt === "string"
              ? post.createdAt
              : new Date(post.createdAt).toISOString(),
        }}
        blog={blog}
        authUserEmail={undefined}
      />
    </>
  );
}
