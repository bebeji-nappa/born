import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { SignInInputs } from "./index";
import { supabase } from '@/libs/supabase';

export const useSignIn = () => {
  const onSubmit: SubmitHandler<SignInInputs> = useCallback(async ({
    email,
    password,
  }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
  
    if (error) {
      console.error(error);
      throw error.message;
    }
  }, []);

  return {
    onSubmit,
  }
};
