import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarStore = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: false,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'sidebar-store',
      partialize: (state) => ({
        isOpen: state.isOpen,
      }),
    },
  ),
);
