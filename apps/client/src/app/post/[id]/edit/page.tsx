"use client";

import { use, useEffect, useState } from "react";
import PostEdit from "@/features/post/components/views/PostEdit";
import { usePost } from "@/features/post/hooks/usePost";
import LoadingSpinner from "@/features/shared/components/elements/LoadingSpinner";
import { PageTitle } from "@/features/shared/components/layouts/PageTitle";
import { useAuth } from "@/features/shared/utils/contexts/AuthContext";

export const dynamic = "force-dynamic";

interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
}

const DEFAULT_THEME: ThemeConfig = {
  backgroundColor: "#dae2e6",
  textColor: "#111827",
  linkColor: "#3b82f6",
};

export default function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const postId = parseInt(id);
  const { post, isLoading, error } = usePost(postId);
  const { user, isLoading: authLoading } = useAuth();
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [themeLoading, setThemeLoading] = useState(true);

  useEffect(() => {
    const fetchBlogTheme = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/blogs/user/${user.id}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();

        if (data.blog?.theme) {
          try {
            setTheme(JSON.parse(data.blog.theme));
          } catch {
            setTheme(DEFAULT_THEME);
          }
        } else {
          setTheme(DEFAULT_THEME);
        }
      } catch (error) {
        console.error("Failed to fetch blog theme", error);
        setTheme(DEFAULT_THEME);
      } finally {
        setThemeLoading(false);
      }
    };

    fetchBlogTheme();
  }, [user?.id]);

  if (isLoading || authLoading || themeLoading) return <LoadingSpinner />;
  if (error || !post) return <div>Post not found</div>;
  if (!user) return <div>Unauthorized</div>;

  return (
    <>
      <PageTitle title={`${post.title}の編集`} />
      <PostEdit
        id={post.id}
        title={post.title}
        content={post.content}
        published={post.published}
        theme={theme}
      />
    </>
  );
}
