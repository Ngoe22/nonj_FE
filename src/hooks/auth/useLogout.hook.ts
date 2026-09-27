'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/lib/axios/axios';

// ---------------------------------------------------------------
// Logout — POST /auth/logout
//
// Sau khi logout PHẢI xoá toàn bộ cache của react-query, vì
// `useLogin` ghi profile vào cache key `['my_profile']` và
// `useGetMyProfile` có staleTime 1 giờ → nếu không clear, user
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
        mutationFn: async () => {
            // BE chỉ có POST /auth/logout/:range (one|all) — gọi thiếu :range sẽ 404
            // và refresh token không bị thu hồi ở server.
            await api.post('/auth/logout/all');
        },
        onSuccess: clearSessionAndRedirect,
        // API lỗi (vd: token đã hết hạn) thì vẫn phải xoá session ở FE
        onError: clearSessionAndRedirect,
    });
}

