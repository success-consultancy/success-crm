import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (value: boolean) => void;
}

export const useSidebarStore = create(
  persist<SidebarState>(
    (set) => ({
      isCollapsed: false,

      toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (value) => set(() => ({ isCollapsed: value })),
    }),
    {
      name: 'sidebar-storage',
    },
  ),
);
