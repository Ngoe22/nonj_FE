'use client'

import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";

interface UserProfile {
    id: string;
    username: string;
    nickname: string;
    email: string;
    bio: string;
}

interface Res {
    data: UserProfile;
}


// useGetUserProfile
export function useGetUserProfile() {

    return useQuery( {
        queryKey: ['user_profile'],
        queryFn: async () => {
            const res :Res = await  api.get( 'user/me' )
            return res.data;
        } ,
        staleTime: 60 * 60 * 1000, // 60 phút
    })
}