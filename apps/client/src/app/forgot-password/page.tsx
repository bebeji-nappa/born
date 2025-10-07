"use client";

import ForgotPasswordTemplate from "@/components/templates/ForgotPassword";
import { PageTitle } from "@/components/common/PageTitle";

export default function ForgotPasswordPage() {
  return (
    <>
      <PageTitle title="パスワードをお忘れですか" />
      <ForgotPasswordTemplate />
    </>
  );
}
