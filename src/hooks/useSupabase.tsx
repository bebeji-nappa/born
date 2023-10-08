import { createClient } from '@supabase/supabase-js'
import { anonKey, supabaseUrl } from '@/constants/supabase';

export const useSupabase = () => {
  const supabase = createClient(supabaseUrl, anonKey);
  return {
    supabase
  };
};

