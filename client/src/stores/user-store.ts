import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = string;

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "user-storage", storage: createJSONStorage(() => localStorage) }
  )
);
