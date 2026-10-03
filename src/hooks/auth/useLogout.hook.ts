'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/lib/axios/axios';

// ---------------------------------------------------------------
// Logout — POST /auth/logout
//
// Sau khi logout PHẢI xoá toàn bộ cache của react-query, vì
// `useLogin` ghi profile vào cache key `['my_profile']` và
// vẫn còn thấy dữ liệu của tài khoản cũ sau khi đăng xuất.
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
            // BE chỉ có POST /auth/logout/:range — gọi thiếu :range sẽ 404 và
            // refresh token không bị thu hồi ở server.
            await api.post(`/auth/logout/${range}`);
        },
        onSuccess: clearSessionAndRedirect,
        // API lỗi (vd: token đã hết hạn) thì vẫn phải xoá session ở FE
        onError: clearSessionAndRedirect,
    });
}

