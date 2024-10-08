import { create } from "zustand";
interface User {
  id: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  department?: string | null;
  image: string | null;
  email: string | null;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserInfoStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
