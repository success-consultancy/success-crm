import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken, removeAccessToken, saveAccessToken } from '@/utils/auth-token';
import { queryClient } from '@/context/tanstack-context';
import useAuthStore from '@/store/auth-store';

const baseURL = process.env.NEXT_PUBLIC_SMS_EMAIL;

export const emailSmsApi = axios.create({
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
emailSmsApi.interceptors.request.use(
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
