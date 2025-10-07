"use client";

import { use } from "react";
import ResetPasswordTemplate from "@/components/templates/ResetPassword";
import { PageTitle } from "@/components/common/PageTitle";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  return (
    <>
      <PageTitle title="パスワードをリセット" />
      <ResetPasswordTemplate token={token} />
    </>
  );
}
