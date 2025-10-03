"use client";

import AccountSettingTemplate from "@/components/templates/AccountSetting";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AccountSettingPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return <AccountSettingTemplate user={user} />;
}
