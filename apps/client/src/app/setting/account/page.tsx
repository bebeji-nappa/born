"use client";

import AccountSetting from "@/features/setting/components/views/AccountSetting";
import LoadingSpinner from "@/features/shared/components/elements/LoadingSpinner";
import { PageTitle } from "@/features/shared/components/layouts/PageTitle";
import { useAuth } from "@/features/shared/utils/contexts/AuthContext";

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
