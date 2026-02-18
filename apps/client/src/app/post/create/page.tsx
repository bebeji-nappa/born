"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PageTitle } from "@/components/common/PageTitle";
import PostCreateTemplate from "@/components/features/PostCreate";
import { useAuth } from "@/contexts/AuthContext";

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

export default function PostCreatePage() {
  const { user, isLoading } = useAuth();
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

  if (isLoading || themeLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle title="新規投稿" />
      <PostCreateTemplate userId={user.id} theme={theme} />
    </>
  );
}
