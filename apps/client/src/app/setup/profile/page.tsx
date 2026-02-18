"use client";

import LoadingSpinner from "@/components/elements/LoadingSpinner";
import { PageTitle } from "@/components/layouts/PageTitle";
import ProfileSetup from "@/features/setup/components/views/ProfileSetup";
import { useAuth } from "@/utils/contexts/AuthContext";

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
