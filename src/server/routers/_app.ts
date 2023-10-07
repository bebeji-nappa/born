import { router } from '../trpc';
import { hello } from './hello.router';
import { getAllUsers } from './users.router';

export const appRouter = router({
  hello,
  getAllUsers,
});

export type AppRouter = typeof appRouter;
