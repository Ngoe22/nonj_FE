import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {api} from "@/lib/axios/axios";
import {authStore} from "@/stores/auth/auth.store";

//----------------------------------------------------------------

interface LoginInfo {
    email: string;
    password: string;
}

export function useLogin () {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation( {
        mutationFn : async (login_info:LoginInfo ) => {
            const res = await  api.post( 'auth/login' ,  login_info)
            return res.data.data;
        } ,
        onSuccess : (res :any) => {
            // console.log(data)
            queryClient.setQueryData([ 'my_profile' ] ,res.info )
            authStore.setAccessToken(res.accessToken);
            router.push('/');
        }
    } )
}