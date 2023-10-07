import { publicProcedure } from '../trpc';
import { getAll } from '../model/users.model';

export const getAllUsers = publicProcedure.query(async () => { return await getAll() });
