'use client'

import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";


export function useUserProfile() {


    return useQuery( {
        queryKey: ['user_profile'],
        queryFn: async () => {
            const res = await  api.get( 'user/me' )
            return res.data;
        } ,
        staleTime: 5 * 60 * 1000, // 5 phút
    })

}