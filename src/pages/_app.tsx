import React, { useCallback, useEffect } from 'react';
import '@/styles/reset.css';
import type { AppType } from 'next/app';
import { trpc } from  '../utils/trpc';
import { supabase } from '@/libs/supabase';
import Router from "next/router";

const MyApp: AppType = ({ Component, pageProps }) => {
  const checkSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    if (!data?.session) {
      Router.push('/sign_in');
    }
  }, []);

  useEffect(() => {
    checkSession();
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        Router.push('/home');
      }
      if (event === 'SIGNED_OUT') {
        Router.push('/sign_in');
      }
    });
  }, [checkSession]);

  return <Component {...pageProps} />;
};
export default trpc.withTRPC(MyApp);
