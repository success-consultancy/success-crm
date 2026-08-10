import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationReadState {
  /** Keys of notifications the user has already seen. */
  readKeys: string[];
  markRead: (key: string) => void;
  markAllRead: (keys: string[]) => void;
}

/**
 * Client-side read tracking for the header notification feed.
 *
 * The backend has no notion of a "notification" — the feed is assembled from
 * leave requests and check-ins — so there is nothing server-side to mark read.
 * This keeps the Unread tab functional today; it is per-device and per-browser,
 * and should be replaced by a real endpoint once notifications are first-class.
 */
const useNotificationReadStore = create<NotificationReadState>()(
  persist(
    (set) => ({
      readKeys: [],
      markRead: (key) =>
        set((state) => (state.readKeys.includes(key) ? state : { readKeys: [...state.readKeys, key] })),
      markAllRead: (keys) =>
        set((state) => {
          const merged = new Set([...state.readKeys, ...keys]);
          return merged.size === state.readKeys.length ? state : { readKeys: [...merged] };
        }),
    }),
    { name: 'notification-read-storage' },
  ),
);

export default useNotificationReadStore;
