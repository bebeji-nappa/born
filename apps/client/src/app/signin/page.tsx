"use client";

import { PageTitle } from "@/components/common/PageTitle";
import SignInTemplate from "@/components/features/SignIn";

export default function SignInPage() {
  return (
    <>
      <PageTitle title="ログイン" />
      <SignInTemplate />
    </>
  );
}
