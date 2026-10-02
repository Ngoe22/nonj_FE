
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { getBeUrl } from '@/lib/api/beUrl';

export const api = axios.create({
    baseURL: getBeUrl(),
    withCredentials: true,
});

// ============ RESPONSE: refresh khi 401 ============
let isRefreshing = false;
// Mỗi request chờ refresh cần cả resolve LẪN reject — nếu chỉ lưu resolve thì khi
// refresh thất bại, các promise xếp hàng sẽ KHÔNG BAO GIỜ kết thúc (treo vĩnh viễn).
let pendingQueue: Array<{
    resolve: () => void;
    reject: (error: unknown) => void;
}> = [];

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
            return new Promise((resolve, reject) => {
                pendingQueue.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            await axios.post(
                `${getBeUrl()}/auth/refresh`,
                {},
                { withCredentials: true },
            );

            pendingQueue.forEach((p) => p.resolve());
            pendingQueue = [];

            return api(originalRequest);
        } catch (refreshError) {
            // reject HẾT request đang chờ để chúng không treo vĩnh viễn
            pendingQueue.forEach((p) => p.reject(refreshError));
            pendingQueue = [];

            if (typeof window !== 'undefined') {
                // giữ locale hiện tại thay vì cứng '/auth' (raw '/auth' sẽ bị
                // middleware redirect về locale mặc định 'vi', mất ngôn ngữ)
                const locale = window.location.pathname.split('/')[1] || 'vi';
                window.location.href = `/${locale}/auth`;
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);
