"use client";

import { PageTitle } from "@/components/PageTitle";
import VerifyEmail from "@/features/VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <>
      <PageTitle title="メールアドレス確認" />
      <VerifyEmail />
    </>
  );
}
