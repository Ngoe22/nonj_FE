
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BE_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:4000';

export const api = axios.create({
    baseURL: BE_URL,
    withCredentials: true,
});

// ============ RESPONSE: refresh khi 401 ============
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryConfig | undefined;

        if (originalRequest?.url?.includes('auth/refresh')) {
            return Promise.reject(error);
        }

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve) => {
                pendingQueue.push(() => resolve(api(originalRequest)));
            });
        }

        isRefreshing = true;

        try {
            await axios.post(
                `${BE_URL}/auth/refresh`,
                {},
                { withCredentials: true },
            );

            pendingQueue.forEach((cb) => cb());
            pendingQueue = [];

            return api(originalRequest);
        } catch (refreshError) {
            pendingQueue = [];

            if (typeof window !== 'undefined') {
                window.location.href = '/auth';
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);