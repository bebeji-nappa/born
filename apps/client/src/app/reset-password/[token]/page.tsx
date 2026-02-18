"use client";

import { use } from "react";
import { PageTitle } from "@/components/layouts/PageTitle";
import ResetPassword from "@/features/reset-password/components/views/ResetPassword";

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
