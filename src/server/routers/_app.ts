import { router } from '../trpc';
import { hello } from '../controllers/hello.controller';
import { getAllUsers } from './users.router'

export const appRouter = router({
  hello,
  getAllUsers,
});

export type AppRouter = typeof appRouter;
