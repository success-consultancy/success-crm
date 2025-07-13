import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import config from "@/config";
import { getTokens, clearTokens, storeTokens } from "@/utils/token";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: config.getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    "x-api-key": config.getApiKey(),
  },
});

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { refreshToken } = getTokens();
    if (!refreshToken) throw new Error("No refresh token available");

    const data = await getNewAccessToken(refreshToken);
    storeTokens(data.payload.access_token);
    return data.payload.access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const isUnauthorized = error.response?.status === 401;
    const isFirstAttempt = !originalRequest._retry;

    if (isUnauthorized && isFirstAttempt) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// Update this function to match endpoint for refreshing tokens [API]
export const getNewAccessToken = async (refreshToken: string) => {
  try {
    const response = await apiClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw error;
  }
};
