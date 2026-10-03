'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

import { useGoogleAuth } from '@/hooks/auth/use_google_auth.hook';

/** Biến module-level — không bao giờ bị reset giữa các lần mount */
let isGoogleInitialized = false;

declare global {
    interface Window {
        google?: any;
    }
}

interface Props {
    mode?: 'login' | 'register';
    onSuccess?: () => void;
}

/**
 * Nút "Tiếp tục với Google".
 *
 * Dùng NÚT CHÍNH CHỦ của Google (`renderButton` — Google tự vẽ nút thật). KHÔNG
 * hack overlay/pointer-events gì cả: cách hack đó đã làm mất nút Google trong
 * DOM và bấm không phản ứng, nên bỏ.
 *
 * Google tự vẽ nút (kể cả trạng thái "Đăng nhập với tên …" khi đã có phiên),
 * vừa đúng chuẩn thương hiệu, vừa chắc chắn bấm được.
 */
export function GoogleLoginButton({ mode = 'login', onSuccess }: Props) {
    const txt = useTranslations('Auth');
    const googleAuth = useGoogleAuth();

    const containerRef = useRef<HTMLDivElement>(null);
    // Giữ bản mới nhất để callback của Google không bị "đóng băng" giá trị cũ
    const googleAuthRef = useRef(googleAuth);
    const onSuccessRef = useRef(onSuccess);

    useEffect(() => {
        googleAuthRef.current = googleAuth;
        onSuccessRef.current = onSuccess;
    });

    useEffect(() => {
        let cancelled = false;

        const render = (): boolean => {
            if (!window.google?.accounts?.id || !containerRef.current) {
                return false;
            }

            if (!isGoogleInitialized) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: (response: { credential?: string }) => {
                        if (!response?.credential) return;
                        googleAuthRef.current.mutate(
                            { credential: response.credential },
                            { onSuccess: onSuccessRef.current },
                        );
                    },
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });
                isGoogleInitialized = true;
            }

            window.google.accounts.id.renderButton(containerRef.current, {
                type: 'standard',
                // hợp với nền tối của app
                theme: 'filled_black',
                size: 'large',
                shape: 'rectangular',
                logo_alignment: 'left',
                locale: 'vi',
                text: mode === 'register' ? 'signup_with' : 'signin_with',
            });

            return true;
        };

        if (!render()) {
            const interval = setInterval(() => {
                if (cancelled) return;
                if (render()) clearInterval(interval);
            }, 100);
            return () => {
                cancelled = true;
                clearInterval(interval);
            };
        }
    }, [mode]);

    return (
        <div className="w-full rounded-2xl border border-border bg-surface/40 px-5 py-5">
            <div className="flex flex-col items-center gap-3">
                {/* Google tự chèn nút CHÍNH CHỦ vào đây */}
                <div
                    ref={containerRef}
                    className="flex min-h-[44px] w-full justify-center [&>div]:!w-full [&_iframe]:!w-full"
                />

                {googleAuth.isPending && (
                    <p className="flex items-center gap-2 text-center text-xs text-muted-foreground">
                        <Loader2 size={14} className="animate-spin" />
                        {txt('continue_with_google')}
                    </p>
                )}
            </div>
        </div>
    );
}
