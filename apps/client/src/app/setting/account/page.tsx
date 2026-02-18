"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PageTitle } from "@/components/common/PageTitle";
import AccountSettingTemplate from "@/components/features/AccountSetting";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountSettingPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle title="アカウント設定" />
      <AccountSettingTemplate user={user} />
    </>
  );
}
