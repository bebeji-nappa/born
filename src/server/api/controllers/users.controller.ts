import { getAll, getAuthUserId, getUserbyId } from '../services/users.service';

/**
 * @get /api/users
 */
export const getAllUsersHandler = async () => await getAll();

export const getAuthUserIdHandler = async (email: string) =>
  await getAuthUserId(email);

export const getUserbyIdHandler = async (id: string) => await getUserbyId(id);
