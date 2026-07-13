import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken, saveAccessToken } from '@/utils/auth-token';
import { queryClient } from '@/context/tanstack-context';
import useAuthStore from '@/store/auth-store';
import { logout } from '@/utils/logout';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const custom_api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// set bearer token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = token;
    }

    // Add branch id to headers
    const user = useAuthStore.getState().profile;
    if (user?.branchId) config.headers['x-branch-id'] = user?.branchId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// generate refresh token
api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          // refresh the access token
          const { data } = await axios.get(baseURL + '/auth/refresh', {
            withCredentials: true,
          });

          if (data) {
            saveAccessToken(data?.payload?.access_token);
          }

          return api(originalConfig as AxiosRequestConfig<unknown>);
        } catch (_error: any) {
          // Refresh failed → the session is no longer valid. Clear auth state and
          // redirect to the login page so the user can sign in again.
          if (_error?.response?.status === 401) {
            if (originalConfig.url !== '/auth/login') {
              queryClient.resetQueries();
            }
            logout();
          }

          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  },
);
