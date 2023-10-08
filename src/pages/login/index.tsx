import React from "react";
import { useSignIn } from "@/hooks/useSignIn";
export default function SignIn() {
  const data = useSignIn({
    email: "example@example.com",
    password: "password"
  });

  return <div />;
}
