import { router } from '../trpc';
import { publicProcedure } from '../trpc';
import {
  signUpHandler,
  signInHandler,
  signOutHandler
} from '../controllers/auth.controller';
import { z } from 'zod';

export const authRouter = router({
  signUp: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      return await signUpHandler(input);
    }),
  signIn: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      return await signInHandler(input);
    }),
  signOut: publicProcedure
    .mutation(async () => {
      return await signOutHandler();
    }),
});
