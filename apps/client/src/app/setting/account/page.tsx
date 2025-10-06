"use client";

import AccountSettingTemplate from "@/components/templates/AccountSetting";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PageTitle } from "@/components/common/PageTitle";

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
