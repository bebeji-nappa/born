import { mergeRouters } from '../trpc';
import { usersRouter } from './users.router'
import { authRouter } from './auth.router';

export const appRouter = mergeRouters(
  usersRouter,
  authRouter,
);

export type AppRouter = typeof appRouter;
