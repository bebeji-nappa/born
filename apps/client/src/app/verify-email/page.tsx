"use client";

import { PageTitle } from "@/features/shared/components/layouts/PageTitle";
import VerifyEmail from "@/features/verify-email/components/views/VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <>
      <PageTitle title="メールアドレス確認" />
      <VerifyEmail />
    </>
  );
}
