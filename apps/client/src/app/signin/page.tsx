"use client";

import SignInTemplate from "@/components/templates/SignIn";
import { PageTitle } from "@/components/common/PageTitle";

export default function SignInPage() {
  return (
    <>
      <PageTitle title="ログイン" />
      <SignInTemplate />
    </>
  );
}
