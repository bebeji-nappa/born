import { useSupabase } from "@/hooks/useSupabase";

export type useSigninParams = {
  email: string;
  password: string;
};

export const useSignIn = async ({
  email,
  password,
}: useSigninParams) => {
  const { supabase } = useSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    console.error(error)
  }
  return data;
};


