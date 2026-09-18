'use client'

import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";

interface UserProfile {
    id: string;
    user_name: string;
    nickname: string;
    email: string;
    bio: string;
    avatar_url: string | null;
    role: string;
    status: string;
}

interface Res {
    data: UserProfile;
}


// useGetUserProfile
export function useGetUserProfile() {
    return useQuery({
        queryKey: ['user_profile'],
        queryFn: async () => {
            const res = await api.get<Res>('user/me');

            return res.data.data;
        },
        staleTime: 60 * 60 * 1000,
    });
}