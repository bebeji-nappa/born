"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PageTitle } from "@/components/common/PageTitle";
import ProfileSetupTemplate from "@/components/features/ProfileSetup";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileSetupPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle title="プロフィール登録" />
      <ProfileSetupTemplate user={user} />
    </>
  );
}
