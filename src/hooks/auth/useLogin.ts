// hooks/mutations/use-login.ts

import {api} from "@/lib/axios/axios";
import {useAuthStore } from "@/stores/auth/auth.strore";
import {useMutation} from "@tanstack/react-query";

export function useLogin() {
    const setAuth = useAuthStore((s :any) => s.setAuth);

    return useMutation({
        mutationFn: async (body: { username: string; password: string }) => {
            const { data } = await api.post('/auth/login', body);
            return data;   // giả định BE trả { access_token, user: {...} }
        },
        onSuccess: (data :any) => {
            setAuth(data.access_token, data.user);   // lưu vào Zustand ngay khi login thành công
        },
    });
}