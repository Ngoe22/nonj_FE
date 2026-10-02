'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

import { api } from '@/lib/axios/axios';
import type { AuthUserInfo } from '@/types/auth/auth.type';

interface GoogleAuthVars {
    credential: string;
}

export function useGoogleAuth() {
    const txt = useTranslations('Toast');
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<AuthUserInfo, Error, GoogleAuthVars>({
        mutationFn: async ({ credential }) => {
            /**
             * BE bọc mọi response trong `{path,statusCode,message,data,timestamp}`
             * (TransformInterceptor), và `googleAuth` trả `info` TRỰC TIẾP nên
             * user nằm ở `res.data.data`.
             *
             * Trước đây lấy `res.data` (cả envelope) rồi ghi vào cache
             * `my_profile`. Hệ quả: `user.user_name` LUÔN undefined ->
             * guard ở HomeLayout đá về /username MỌI LẦN login Google, kể cả
             * tài khoản đã có username. Vào màn đó rồi thì cache (stale 5 phút)
             * vẫn sai shape nên không tự thoát, và nhập lại username cũ thì
             * nút Check báo "đã bị dùng" -> kẹt hẳn.
             *
             * (So sánh: `useLogin` của email làm ĐÚNG — `res.data.data.info`.)
             */
            const res = await api.post<{ data: AuthUserInfo }>('/auth/google', {
                credential,
            });
            return res.data.data;
        },

        onSuccess: (user) => {
            queryClient.setQueryData(['my_profile'], user);
            router.push('/');
        },

        onError: (err: any) => {
            const code = err?.response?.data?.errorCode;

            if (code === 'banned_account') {
                toast.error(txt('banned_account'));
                return;
            }

            toast.error(txt('login_fail'));
        },
    });
}