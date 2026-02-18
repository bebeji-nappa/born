"use client";

import { PageTitle } from "@/features/shared/components/layouts/PageTitle";
import EmailSent from "@/features/verify-email-sent/components/views/EmailSent";

export default function VerifyEmailSentPage() {
  return (
    <>
      <PageTitle title="確認メール送信完了" />
      <EmailSent />
    </>
  );
}
