import { router } from '../trpc';
import { publicProcedure } from '../trpc';
import {
  getAllUsersHandler,
  getAuthUserIdHandler,
  getUserbyEmailHandler,
  getUserbyIdHandler,
} from '../controllers/users.controller';
import { z } from 'zod';

export const usersRouter = router({
  getAllUsers: publicProcedure.query(async () => await getAllUsersHandler()),
  getAuthUserId: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async (opts) => await getAuthUserIdHandler(opts.input.email)),
  getUserbyId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => await getUserbyIdHandler(opts.input.id)),
  getUserbyEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async (opts) => await getUserbyEmailHandler(opts.input.email)),
});
