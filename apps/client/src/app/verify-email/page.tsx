"use client";

import { PageTitle } from "@/components/layouts/PageTitle";
import VerifyEmail from "@/features/verify-email/components/VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <>
      <PageTitle title="メールアドレス確認" />
      <VerifyEmail />
    </>
  );
}
