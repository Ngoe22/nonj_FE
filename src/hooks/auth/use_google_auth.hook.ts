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
            const res = await api.post<AuthUserInfo>('/auth/google', { credential });
            return res.data;
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