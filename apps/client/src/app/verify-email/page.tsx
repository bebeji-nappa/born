"use client";

import VerifyEmailTemplate from "@/components/templates/VerifyEmail";
import { PageTitle } from "@/components/common/PageTitle";

export default function VerifyEmailPage() {
  return (
    <>
      <PageTitle title="メールアドレス確認" />
      <VerifyEmailTemplate />
    </>
  );
}
