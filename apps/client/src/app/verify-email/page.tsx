"use client";

import { useSearchParams } from "next/navigation";
import VerifyEmailTemplate from "@/components/templates/VerifyEmail";
import { PageTitle } from "@/components/common/PageTitle";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <>
      <PageTitle title="メールアドレス確認" />
      <VerifyEmailTemplate token={token} />
    </>
  );
}
