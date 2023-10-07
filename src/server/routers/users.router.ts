import { publicProcedure } from '../trpc';
import { getAllUsersHandler } from '../controllers/users.controller';

export const getAllUsers = publicProcedure.query(async () => await getAllUsersHandler());
