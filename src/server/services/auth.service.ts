import { supabase } from '@/contants/supabase';

export type signInParams = {
  email: string;
  password: string;
};

export type signUpParams = {
  email: string;
  password: string;
};

export const signUp = async ({
  email,
  password,
}: signUpParams) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

export const signIn = async ({
  email,
  password,
}: signInParams) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    console.error(error);
    throw error.message;
  }
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw error;
  }
  return true;
};
