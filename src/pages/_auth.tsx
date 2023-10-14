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
    email: data?.user?.email || '',
  });

  useEffect(() => {
    if (status === 'authenticated' && data?.user) {
      const userData = {
        id: user?.data?.userId,
        email: data?.user?.email || '',
        name: data?.user?.name || '',
      };
      useStore.setState({
        user: userData,
      });
    }

    if (status === 'unauthenticated' && router.pathname !== '/signin') {
      router.push('/signin');
    }
    if (status === 'authenticated' && router.pathname === '/signin') {
      router.push('/home');
    }
    setLoading(false);
  }, [router, status, setLoading, data, user]);

  return !loading && children;
}
