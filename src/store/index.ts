import { create } from 'zustand';

export type User = {
  id: string | undefined;
  email: string | undefined;
  name: string | undefined;
};

/* eslint no-unused-vars: off */
export type State = {
  user: User;
  setUser: (payload: User) => void;
};

const useStore = create<State>((set) => ({
  user: { id: '', email: '', name: '' },
  setUser: (payload) => set({ user: payload }),
}));

export default useStore;
