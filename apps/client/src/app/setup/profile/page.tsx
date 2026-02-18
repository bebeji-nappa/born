"use client";

import ProfileSetup from "@/features/setup/components/views/ProfileSetup";
import LoadingSpinner from "@/features/shared/components/elements/LoadingSpinner";
import { PageTitle } from "@/features/shared/components/layouts/PageTitle";
import { useAuth } from "@/features/shared/utils/contexts/AuthContext";

export default function ProfileSetupPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle title="プロフィール登録" />
      <ProfileSetup user={user} />
    </>
  );
}
