"use client";

import { PageTitle } from "@/components/PageTitle";
import EmailSent from "@/features/EmailSent";

export default function VerifyEmailSentPage() {
  return (
    <>
      <PageTitle title="確認メール送信完了" />
      <EmailSent />
    </>
  );
}
