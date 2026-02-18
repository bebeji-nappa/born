"use client";

import LoadingSpinner from "@/components/elements/LoadingSpinner";
import { PageTitle } from "@/components/layouts/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSetup from "@/features/setup/profile/components/ProfileSetup";

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
