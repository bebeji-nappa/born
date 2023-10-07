import { z } from 'zod';
import { publicProcedure } from '../trpc';

export const hello = publicProcedure
  .input(
    z.object({
      text: z.string().max(10),
    })
  )
  .query((opts) => {
    return {
      greeting: `hello ${opts.input.text}`,
    };
  });
