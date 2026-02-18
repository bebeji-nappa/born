"use client";

import LoadingSpinner from "@/components/elements/LoadingSpinner";
import { PageTitle } from "@/components/layouts/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import AccountSetting from "@/features/AccountSetting";

export default function AccountSettingPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle title="アカウント設定" />
      <AccountSetting user={user} />
    </>
  );
}
