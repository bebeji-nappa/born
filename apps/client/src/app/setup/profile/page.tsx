"use client";

import ProfileSetupTemplate from "@/components/templates/ProfileSetup";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PageTitle } from "@/components/common/PageTitle";

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
