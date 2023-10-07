import { router } from '../trpc';
import { publicProcedure } from '../trpc';
import { getAllUsersHandler } from '../controllers/users.controller';

export const usersRouter = router({
  getAllUsers: publicProcedure.query(async () => await getAllUsersHandler()),
});
