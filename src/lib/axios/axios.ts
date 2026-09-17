// lib/axios.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000',
    withCredentials: true, // Bắt buộc để trình duyệt tự động gửi/nhận HttpOnly Cookie
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    pendingQueue.push(() => {
                        resolve(api(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                // Gọi refresh token. NestJS sẽ tự động Set-Cookie mới (cả access_token & refresh_token) về trình duyệt
                await axios.post(
                    `${process.env.BE_URL || 'http://localhost:4000'}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                // Chạy lại hàng đợi request bị kẹt
                pendingQueue.forEach((cb) => cb());
                pendingQueue = [];

                return api(originalRequest); // Gửi lại request cũ, trình duyệt tự đính kèm cookie mới
            } catch (refreshError) {
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);