import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IAppStateStore {
  // sidebar
  isSidebarCollapsed: boolean;
  handleToggleSidebarCollapse: (state: boolean) => void;
}

const useAppStateStore = create<IAppStateStore>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false, // Default to expanded
      handleToggleSidebarCollapse: (state) => {
        set({ isSidebarCollapsed: state });
      },
    }),
    {
      name: 'app-state-storage', // Name of the storage key
    }
  )
);

export { useAppStateStore };
