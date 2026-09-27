import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";
import {useRouter} from "@/i18n/navigation";
import type {AuthUserInfo} from "@/types/auth/auth.type";

//----------------------------------------------------------------

interface LoginInfo {
    email: string;
    password: string;
}

export function useLogin () {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation( {
        mutationFn : async (login_info:LoginInfo): Promise<AuthUserInfo> => {
            // BE bọc response: { data: { info: user } } → phải lấy .info
            const res = await api.post<{ data: { info: AuthUserInfo } }>('/auth/login', login_info)
            return res.data.data.info;
        } ,
        onSuccess : (user: AuthUserInfo) => {
            // cache 'my_profile' lưu thẳng user (giống GET /user/me) để trang chủ đọc đúng
            queryClient.setQueryData([ 'my_profile' ] , user )
            router.push('/');
        }
    } )
}
