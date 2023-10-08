/*
  ログアウト処理を行うカスタムフック。
  server に移行するかもしれない。
*/

import { useSupabase } from "@/hooks/useSupabase";

export const useSignOut = async () => {
  const { supabase } = useSupabase();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};


