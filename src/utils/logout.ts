import useAuthStore, { AUTH_STORAGE_KEY } from '@/store/auth-store';
import { clearTokens } from '@/utils/token';

/**
 * Logs the current user out: clears the auth tokens and the persisted profile,
 * then (by default) redirects to the login page so they can sign in again.
 *
 * Used both for the manual "Sign out" action and when a session expires
 * (refresh-token failure in the API interceptor).
 */
export const logout = ({ redirect = true }: { redirect?: boolean } = {}): void => {
  clearTokens();

  // Clear the persisted auth store so no stale profile remains after logout.
  useAuthStore.setState({ profile: null });

  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    // Avoid redirect loops when already on the login page.
    if (redirect && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
};
