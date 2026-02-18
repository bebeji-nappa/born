"use client";

import { PageTitle } from "@/features/shared/components/layouts/PageTitle";
import SignUp from "@/features/signup/components/views/SignUp";

export default function SignUpPage() {
  return (
    <>
      <PageTitle title="新規登録" />
      <SignUp />
    </>
  );
}
