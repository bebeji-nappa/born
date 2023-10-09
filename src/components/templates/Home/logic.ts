import { useCallback, useEffect } from "react";
import { trpc } from '@/utils/trpc';
import Router from "next/router";

export const useSignOut = () => {
  const mutation = trpc.signOut.useMutation();
  const handlePress = useCallback(async () => {
    mutation.mutate();
  }, [mutation]);

  useEffect(() => {
    if (mutation.isSuccess) {
      Router.push("/sign_in");
    }
  }, [mutation]);

  return {
    handlePress,
    mutation,
  }
};
