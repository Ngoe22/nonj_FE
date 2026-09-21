
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {api} from "@/lib/axios/axios";

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
            const res = await  api.post( '/auth/register' ,  login_info)
            return res.data.data;
        } ,
        onSuccess : ( user:any) => {
            console.log(user)
            queryClient.setQueryData([ 'my_profile' ] ,user )
            router.push('/');
        }
    } )
}