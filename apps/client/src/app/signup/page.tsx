"use client";

import { PageTitle } from "@/components/common/PageTitle";
import SignUpTemplate from "@/components/templates/SignUp";

export default function SignUpPage() {
  return (
    <>
      <PageTitle title="新規登録" />
      <SignUpTemplate />
    </>
  );
}
