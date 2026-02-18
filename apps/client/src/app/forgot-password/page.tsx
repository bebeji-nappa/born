"use client";

import { PageTitle } from "@/components/layouts/PageTitle";
import ForgotPassword from "@/features/forgot-password/components/views/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <>
      <PageTitle title="パスワードをお忘れですか" />
      <ForgotPassword />
    </>
  );
}
