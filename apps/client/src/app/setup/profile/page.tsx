"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { PageTitle } from "@/components/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSetup from "@/features/ProfileSetup";

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
