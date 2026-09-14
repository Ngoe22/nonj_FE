// hooks/mutations/use-login.ts

import {api} from "@/lib/axios/axios";
import {useAuthStore} from "@/stores/auth/auth.strore";
import {useMutation} from "@tanstack/react-query";

export function useLogin() {
    const setAuth = useAuthStore((s :any) => s.setAuth);

    return useMutation({
        mutationFn: async (body: { email: string; password: string }) => {
            return await api.post('/auth/login', body);
        },
        onSuccess: (data :any) => {
            setAuth(data.access_token, data.user);   // save to  Zustand
        },
    });
}