"use client";

import { PageTitle } from "@/components/common/PageTitle";
import VerifyEmailTemplate from "@/components/templates/VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <>
      <PageTitle title="メールアドレス確認" />
      <VerifyEmailTemplate />
    </>
  );
}
