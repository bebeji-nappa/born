import NextAuth from 'next-auth/next';
import GithubProvider from 'next-auth/providers/github';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/* eslint @typescript-eslint/no-explicit-any: off */
export const authOptions = {
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token, user }: any) {
      if (session.user) {
        session.user = user;
      }
      if (session.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: '/signin',
  },
};

export default NextAuth(authOptions);
