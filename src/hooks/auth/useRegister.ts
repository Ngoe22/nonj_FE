import {api} from "@/lib/axios/axios";
import {useAuthStore} from "@/stores/auth/auth.strore";
import {useMutation} from "@tanstack/react-query";

interface Body {
    email: string;
    password: string ;
    user_name : string;
    nickname : string;
    bio : string;
}


export function useRegister() {
    const setAuth = useAuthStore((s :any) => s.setUser);

    return useMutation({
        mutationFn: async (body: Body) => {
            return await api.post('/auth/register', body);
        },
        onSuccess: (data :any) => {
            setAuth( data);   // save to  Zustand
        },
    });
}