"use client";

import { PageTitle } from "@/components/layouts/PageTitle";
import SignIn from "@/features/signin/components/SignIn";

export default function SignInPage() {
  return (
    <>
      <PageTitle title="ログイン" />
      <SignIn />
    </>
  );
}
