import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {api} from "@/lib/axios/axios";

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
        onSuccess : (data:LoginInfo) => {
            // console.log(data)
            queryClient.setQueryData([ 'my_profile' ] ,data )
            router.push('/');
        }
    } )
}