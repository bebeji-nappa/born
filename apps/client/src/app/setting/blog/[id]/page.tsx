"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/elements/LoadingSpinner";
import { PageTitle } from "@/components/layouts/PageTitle";
import BlogSetting from "@/features/setting/components/views/BlogSetting";
import { getCurrentUser, type User } from "@/utils/api";

export default function BlogSettingPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        if (!result?.user) {
          router.push("/");
          return;
        }
        setUser(result.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <PageTitle title="ブログ設定" />
      <BlogSetting blogId={Number(params.id)} user={user} />
    </>
  );
}
