/*
  Eメール経由での新規登録処理を行うカスタムフック。
  server に移行するかもしれない。
*/

import { useSupabase } from "@/hooks/useSupabase";

export type useSignUpParams = {
  email: string;
  password: string;
};

export const useSignUp = async ({
  email,
  password,
}: useSignUpParams) => {
  const { supabase } = useSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  if (error) {
    console.error(error)
  }
  return data;
};


