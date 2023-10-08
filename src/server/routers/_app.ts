import { router, mergeRouters } from '../trpc';
import { usersRouter } from './users.router'

export const appRouter = mergeRouters(
  usersRouter,
);

export type AppRouter = typeof appRouter;
