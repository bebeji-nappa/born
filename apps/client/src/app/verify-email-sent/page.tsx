"use client";

import EmailSentTemplate from "@/components/templates/EmailSent";
import { PageTitle } from "@/components/common/PageTitle";

export default function VerifyEmailSentPage() {
  return (
    <>
      <PageTitle title="確認メール送信完了" />
      <EmailSentTemplate />
    </>
  );
}
