// lib/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {authStore} from "@/stores/auth/auth.store";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:4000';

export const api = axios.create({
    baseURL: BE_URL,
    withCredentials: true, // gửi HttpOnly refresh cookie
});

// ============ REQUEST: gắn access token vào header ============
api.interceptors.request.use((config) => {
    const token = authStore.getAccessToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ============ RESPONSE: refresh khi 401 ============
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryConfig | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Nếu đang refresh → xếp hàng chờ
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingQueue.push((newToken) => {
                    if (!newToken) {
                        reject(error);
                        return;
                    }
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(originalRequest));
                });
            });
        }

        isRefreshing = true;

        try {
            // Gọi refresh — BE set cookie refresh mới, trả access token mới trong body
            const { data } = await axios.post<{
                data: any;
                newAccessToken: string }>(
                `${BE_URL}auth/refresh`,
                {},
                { withCredentials: true },
            );

            const newAccessToken = data.data.newAccessToken;
            authStore.setAccessToken(newAccessToken);

            // Chạy hàng đợi
            pendingQueue.forEach((cb) => cb(newAccessToken));
            pendingQueue = [];

            // Retry request gốc với token mới
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            // Refresh fail → xoá token + đá về login
            authStore.clear();
            pendingQueue.forEach((cb) => cb(null));
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