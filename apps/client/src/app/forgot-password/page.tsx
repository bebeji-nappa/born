"use client";

import { PageTitle } from "@/components/layouts/PageTitle";
import ForgotPassword from "@/features/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <>
      <PageTitle title="パスワードをお忘れですか" />
      <ForgotPassword />
    </>
  );
}
