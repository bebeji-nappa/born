import { useCallback } from 'react';
import { supabase } from '@/libs/supabase';

export const useSignOut = () => {
  const handlePress = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  return {
    handlePress,
  };
};
