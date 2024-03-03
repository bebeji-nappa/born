import { getAll, getAuthUserId } from '../services/users.service';

/**
 * @get /api/users
 */
export const getAllUsersHandler = async () => await getAll();

export const getAuthUserIdHandler = async (email: string) =>
  await getAuthUserId(email);
