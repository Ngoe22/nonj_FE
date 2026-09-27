'use client'

import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";
import type { AuthUserInfo } from '@/types/auth/auth.type';



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
    data: AuthUserInfo;
}




export function useGetMyProfile(enabled = true) {
    return useQuery<AuthUserInfo | null>({
        queryKey: ['my_profile'],
        queryFn: async () => {
            try {
                const res = await api.get<{ data: AuthUserInfo }>('user/me');
                return res.data.data;
            } catch (err: any) {
                if (err?.response?.status === 401) return null;
                throw err;
            }
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}

// useGetMyProfile
// export function useGetMyProfile() {
//     return useQuery({
//         queryKey: ['my_profile'],
//         queryFn: async () => {
//             const res = await api.get<Res>('user/me');
//
//             return res.data.data;
//         },
//         staleTime: 60 * 60 * 1000,
//     });
// }