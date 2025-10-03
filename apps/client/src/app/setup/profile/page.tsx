"use client";

import ProfileSetupTemplate from "@/components/templates/ProfileSetup";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function ProfileSetupPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return <ProfileSetupTemplate user={user} />;
}
