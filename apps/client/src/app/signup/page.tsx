"use client";

import SignUpTemplate from "@/components/templates/SignUp";
import { PageTitle } from "@/components/common/PageTitle";

export default function SignUpPage() {
  return (
    <>
      <PageTitle title="新規登録" />
      <SignUpTemplate />
    </>
  );
}
