import axios from 'axios';
import {useAuthStore} from "@/stores/auth/auth.strore";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

    api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            // redirect login nếu cần
        }
        return Promise.reject(error);
    },
);