import { create } from 'zustand';

interface Target {
  url: string;
  type?: 'replace' | 'push';
}

interface NavigationBlockerState {
  isBlocked: boolean;
  target?: Target | null;
  isAlertShown: boolean;
  setIsBlocked: (isBlocked: boolean) => void;
  setTarget: (target: Target) => void;
  setIsAlertShown: (isAlertShown: boolean) => void;
}

const useNavigationBlockerState = create<NavigationBlockerState>()((set) => ({
  isBlocked: false,
  isAlertShown: false,
  setTarget: ({ url, type = 'push' }) => {
    set({
      target: {
        url,
        type,
      },
    });
  },

  // UPDATING NAVIGATION STATE
  setIsBlocked: (isBlocked) => {
    if (isBlocked) {
      set({
        isBlocked: true,
      });
    } else {
      set({
        isBlocked: false,
        isAlertShown: false,
      });
    }
  },
  setIsAlertShown: (isAlertShown) => {
    set({
      isAlertShown,
    });
  },
}));

export default useNavigationBlockerState;
