
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {api} from "@/lib/axios/axios";
import {authStore} from "@/stores/auth/auth.store";

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
        mutationFn : async (login_info:RegisterInfo ) => {
            const res = await  api.post( 'auth/register' ,  login_info)
            return res.data;
        } ,
        onSuccess : (res :any) => {
            console.log(res)
            queryClient.setQueryData([ 'my_profile' ] ,res.info )
            authStore.setAccessToken(res.accessToken);
            router.push('/');
        }
    } )
}