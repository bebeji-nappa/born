import { mergeRouters } from '../trpc';
import { usersRouter } from './users.router';
import { postRouter } from './post.router';

export const appRouter = mergeRouters(usersRouter, postRouter);

export type AppRouter = typeof appRouter;
