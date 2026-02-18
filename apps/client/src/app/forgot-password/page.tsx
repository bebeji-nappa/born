"use client";

import ForgotPassword from "@/features/forgot-password/components/views/ForgotPassword";
import { PageTitle } from "@/features/shared/components/layouts/PageTitle";

export default function ForgotPasswordPage() {
  return (
    <>
      <PageTitle title="パスワードをお忘れですか" />
      <ForgotPassword />
    </>
  );
}
