import { router, mergeRouters } from '../trpc';
import { hello } from '../controllers/hello.controller';
import { usersRouter } from './users.router'

const demoRouter = router({
  hello,
});

export const appRouter = mergeRouters(
  demoRouter,
  usersRouter,
);

export type AppRouter = typeof appRouter;
