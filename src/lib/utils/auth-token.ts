const ACCESS_TOKEN_VARIABLE = 'accessToken';
const REFRESH_TOKEN_VARIABLE = 'refreshToken';

// get user access token from local storage
const getAccessToken = () => {
    if (typeof window === 'undefined') return undefined;
    return localStorage?.getItem?.(ACCESS_TOKEN_VARIABLE);
};

// save user access token to local storage
const saveAccessToken = (accessToken: string) => {
    if (typeof window === 'undefined') return undefined;
    return localStorage?.setItem?.(ACCESS_TOKEN_VARIABLE, accessToken);
};

const removeAccessToken = () => {
    if (typeof window === 'undefined') return undefined;
    return localStorage?.removeItem?.(ACCESS_TOKEN_VARIABLE);
};

export { getAccessToken, saveAccessToken, removeAccessToken, ACCESS_TOKEN_VARIABLE, REFRESH_TOKEN_VARIABLE };
