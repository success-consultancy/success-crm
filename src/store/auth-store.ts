import { IUser } from "@/types/user-type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  profile: IUser | null;
  setProfile: (profile: IUser | null) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      // SET USER PROFILE
      setProfile: (profile) => {
        set({ profile }, false);
      },
    }),
    {
      name: 'auth-storage', // Name of the storage key
    },
  ),
);

export default useAuthStore;
