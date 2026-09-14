// lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth/auth.strore';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
    (res) => res,


    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;   // tránh lặp vô hạn nếu refresh cũng fail

            if (isRefreshing) {
                // nếu đang refresh rồi, các request khác xếp hàng chờ, không gọi refresh nhiều lần cùng lúc
                return new Promise((resolve) => {
                    pendingQueue.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true },   // gửi kèm cookie refresh_token
                );

                useAuthStore.getState().setAuth(data.access_token, useAuthStore.getState().user);

                pendingQueue.forEach((cb) => cb(data.access_token));
                pendingQueue = [];

                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return api(originalRequest);   // gọi lại request ban đầu với token mới
            } catch (refreshError) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);