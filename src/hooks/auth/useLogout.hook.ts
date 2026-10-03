'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/lib/axios/axios';

// ---------------------------------------------------------------
// Logout — POST /auth/logout
// Sau khi logout PHẢI xoá toàn bộ cache của react-query
// ---------------------------------------------------------------

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const clearSessionAndRedirect = () => {
        queryClient.clear();
        router.push('/auth');
    };

    return useMutation({
        /**
         * `one`  = chỉ thu hồi phiên hiện tại (thiết bị này)
         * `all`  = thu hồi MỌI phiên trên mọi thiết bị
         *
         */
        mutationFn: async (range: 'one' | 'all') => {

            await api.post(`/auth/logout/${range}`);
        },
        onSuccess: clearSessionAndRedirect,
        onError: clearSessionAndRedirect,
    });
}

