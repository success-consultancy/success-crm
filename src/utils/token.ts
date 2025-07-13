/**
 * Stores authentication tokens in localStorage.
 *
 * @param accessToken - The access token to store.
 * @param refreshToken - The refresh token to store.
 */

export const storeTokens = (
  accessToken?: string,
  refreshToken?: string
): void => {
  if (typeof window !== "undefined") {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }
};

/**
 * Retrieves authentication tokens from localStorage.
 *
 * @returns An object containing the accessToken and refreshToken,
 *          or null values if not available or called server-side.
 */
export const getTokens = (): {
  accessToken: string | null;
  refreshToken: string | null;
} => {
  if (typeof window !== "undefined") {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  }
  return {
    accessToken: null,
    refreshToken: null,
  };
};

/**
 * Clears authentication tokens from localStorage.
 */
export const clearTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
