import { trpc } from '@/utils/trpc';

export const useIsAuth = () => {
  const { data } = trpc.isAuthed.useQuery();
  return data?.isAuthed ?? "loading";
};
