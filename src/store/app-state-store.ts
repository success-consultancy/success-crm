import { create } from 'zustand';


interface IAppStateStore {


    // sidebar
    isSidebarCollapsed: boolean;
    handleToggleSidebarCollapse: (state: boolean) => void;
}

const useAppStateStore = create<IAppStateStore>()((set) => ({
    isSidebarCollapsed: true,


    handleToggleSidebarCollapse: (state) => {
        set({ isSidebarCollapsed: state });
    },
}));



export { useAppStateStore };
