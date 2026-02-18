"use client";

import { PageTitle } from "@/components/common/PageTitle";
import ForgotPasswordTemplate from "@/components/features/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <>
      <PageTitle title="パスワードをお忘れですか" />
      <ForgotPasswordTemplate />
    </>
  );
}
