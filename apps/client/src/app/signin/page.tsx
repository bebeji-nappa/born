"use client";

import { PageTitle } from "@/features/shared/components/layouts/PageTitle";
import SignIn from "@/features/signin/components/views/SignIn";

export default function SignInPage() {
  return (
    <>
      <PageTitle title="ログイン" />
      <SignIn />
    </>
  );
}
