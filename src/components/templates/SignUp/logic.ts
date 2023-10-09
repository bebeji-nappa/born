import { useCallback, useEffect } from "react";
import { trpc } from '@/utils/trpc';
import type { SubmitHandler } from "react-hook-form";
import Router from "next/router";
import type { SignUpInputs } from "./index";

export const useSignUp = () => {
  const mutation = trpc.signUp.useMutation();
  const onSubmit: SubmitHandler<SignUpInputs> = useCallback(async ({
    email,
    password,
  }) => {
    mutation.mutate({ email, password });
  }, [mutation]);

  useEffect(() => {
    if (mutation.isSuccess) {
      Router.push("/sign_in");
    }
  }, [mutation]);

  return {
    onSubmit,
    mutation,
  }
};
