"use client";

import { PageTitle } from "@/components/common/PageTitle";
import EmailSentTemplate from "@/components/templates/EmailSent";

export default function VerifyEmailSentPage() {
  return (
    <>
      <PageTitle title="確認メール送信完了" />
      <EmailSentTemplate />
    </>
  );
}
