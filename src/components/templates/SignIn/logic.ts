import { useCallback, useEffect } from "react";
import { trpc } from '@/utils/trpc';
import type { SubmitHandler } from "react-hook-form";
import Router from "next/router";
import type { SignInInputs } from "./index";

export const useSignIn = () => {
  const mutation = trpc.signIn.useMutation();
  const onSubmit: SubmitHandler<SignInInputs> = useCallback(({
    email,
    password,
  }) => {
    mutation.mutate({ email, password });
  }, [mutation]);

  useEffect(() => {
    if (mutation.isSuccess) {
      Router.push("/home");
    }
  }, [mutation]);

  return {
    onSubmit,
    mutation,
  }
};
