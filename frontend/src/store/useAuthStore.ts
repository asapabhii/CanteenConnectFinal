import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  token: string | null;
  user: any | null; // We'll define a proper User type later
};

type Actions = {
  setToken: (token: string, user: any) => void;
  logout: () => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token: string, user: any) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    },
  ),
);