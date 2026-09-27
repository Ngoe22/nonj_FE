
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";
import {useRouter} from "@/i18n/navigation";
import type {AuthUserInfo} from "@/types/auth/auth.type";

interface RegisterInfo {
    email: string;
    password: string;
    user_name: string;
    nickname: string;
    bio?: string;
}

export function useRegister () {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation( {
        mutationFn : async (register_info:RegisterInfo): Promise<AuthUserInfo> => {
            // BE bọc response: { data: { info: user } } → phải lấy .info
            const res = await api.post<{ data: { info: AuthUserInfo } }>('/auth/register', register_info)
            return res.data.data.info;
        } ,
        onSuccess : ( user: AuthUserInfo ) => {
            // cache 'my_profile' lưu thẳng user (giống GET /user/me)
            queryClient.setQueryData([ 'my_profile' ] ,user )
            router.push('/');
        }
    } )
}