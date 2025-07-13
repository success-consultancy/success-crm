import { create } from "zustand";

type HeaderStore = {
  title: string;
  setTitle: (title: string) => void;
};

export const useHeaderStore = create<HeaderStore>((set) => ({
  title: "Dashboard",
  setTitle: (title) => set({ title }),
}));
