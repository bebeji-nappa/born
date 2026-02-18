"use client";

import { use } from "react";
import ResetPassword from "@/features/reset-password/components/views/ResetPassword";
import { PageTitle } from "@/features/shared/components/layouts/PageTitle";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  return (
    <>
      <PageTitle title="パスワードをリセット" />
      <ResetPassword token={token} />
    </>
  );
}
