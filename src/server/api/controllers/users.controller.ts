import { getAll, getAuthUserId } from '../services/users.service';

export const getAllUsersHandler = async () => await getAll();

export const getAuthUserIdHandler = async (email: string) =>
  await getAuthUserId(email);
