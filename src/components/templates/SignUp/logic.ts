import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { SignUpInputs } from "./index";
import { supabase } from '@/libs/supabase';

export const useSignUp = () => {
  const onSubmit: SubmitHandler<SignUpInputs> = useCallback(async ({
    email,
    password,
  }) => {
    const { data, error } = await supabase.auth.signUp({
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
