import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useStore from '../store';
import { trpc } from '../utils/trpc';

export type AuthGuardProps = {
  children: React.ReactNode;
};

/**
 * 認証済みかどうかを判定し、リダイレクト先を変更する
 */
export default function AuthGuardPrivider({ children }: AuthGuardProps) {
  const { status, data } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = trpc.getAuthUserId.useQuery({
    email: data?.user?.email ?? '',
  });

  useEffect(() => {
    if (status === 'authenticated' && data?.user) {
      const userData = {
        id: user?.data?.userId,
        email: data?.user?.email ?? '',
        name: data?.user?.name ?? '',
      };
      useStore.setState({
        user: userData,
      });
    }

    if (
      router.pathname === '/post/create' ||
      /^\/post\/\d+\/edit$/.test(router.pathname)
    ) {
      if (status === 'unauthenticated') {
        router.push('/signin');
        return;
      }
    }

    if (status === 'authenticated' && router.pathname === '/signin') {
      router.push('/');
    }
    setLoading(false);
  }, [router, status, setLoading, data, user]);

  return !loading && children;
}
