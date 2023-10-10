import '@/styles/reset.css';
import type { AppType } from 'next/app';
import { trpc } from  '../utils/trpc';
import { SessionProvider } from "next-auth/react"

const MyApp: AppType<{ session: any }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};
export default trpc.withTRPC(MyApp);
