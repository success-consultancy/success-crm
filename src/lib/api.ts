import axios, { AxiosRequestConfig } from "axios";
import { getAccessToken, removeAccessToken, saveAccessToken } from "./utils/auth-token";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/components/providers/query-provider";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
    baseURL,
    headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json'
    },
});



// set bearer token
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

//  generate refresh token
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
                    const { data } = await axios.get(baseURL + '/user/auth/refresh', {
                        withCredentials: true,
                    });

                    if (data) {
                        saveAccessToken(data?.payload?.access_token);
                    }

                    return api(originalConfig as AxiosRequestConfig<unknown>);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (_error: any) {
                    // if expired token clear auth states , It triggers redirect to login page
                    if (_error?.response?.status === 401) {
                        if (getAccessToken()) {
                            toast({
                                title: 'Session has expired',
                                variant: 'destructive'
                            });
                        }

                        removeAccessToken();
                        if (originalConfig.url !== '/user/auth/login') {
                            queryClient.resetQueries();
                        }

                        // clear auth store if session expires
                        // useAuthStore.setState({ profile: null, masqueradingAs: '', isMasquerading: false, websiteId: '' });
                    }

                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    },
);