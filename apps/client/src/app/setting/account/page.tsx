"use client";

import LoadingSpinner from "@/components/elements/LoadingSpinner";
import { PageTitle } from "@/components/layouts/PageTitle";
import AccountSetting from "@/features/setting/components/views/AccountSetting";
import { useAuth } from "@/utils/contexts/AuthContext";

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
