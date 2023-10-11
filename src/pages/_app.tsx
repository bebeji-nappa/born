import '@/styles/reset.css';
import type { AppType } from 'next/app';
import { trpc } from  '../utils/trpc';
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import AuthGuardPrivider from './_auth';

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthGuardPrivider>
        <Component {...pageProps} />
      </AuthGuardPrivider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
