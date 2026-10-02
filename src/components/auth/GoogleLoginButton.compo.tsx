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
 * ⚠️ Dùng NÚT CHÍNH CHỦ của Google (`renderButton` để Google tự vẽ).
 *
 * Trước đây component bọc 1 nút custom + phủ 1 overlay trong suốt chứa iframe
 * Google lên trên. Cách đó KHÔNG đáng tin: iframe không phủ đúng kích thước nút
 * (Google vẽ iframe theo `width` px cố định, còn nút custom thì co giãn), và
 * overlay còn bị `aria-hidden` khiến trình duyệt chặn focus — hậu quả là bấm
 * vào nút KHÔNG PHẢN ỨNG.
 *
 * Dùng nút chính chủ thì chắc chắn bấm được, lại còn đúng chuẩn thương hiệu
 * Google (người dùng tin hơn).
 */
export function GoogleLoginButton({ mode = 'login', onSuccess }: Props) {
    const txt = useTranslations('Auth');
    const googleAuth = useGoogleAuth();

    const containerRef = useRef<HTMLDivElement>(null);
    // Giữ bản mới nhất để callback của Google không bị "đóng băng" giá trị cũ
    const googleAuthRef = useRef(googleAuth);
    const onSuccessRef = useRef(onSuccess);
    const modeRef = useRef(mode);

    useEffect(() => {
        googleAuthRef.current = googleAuth;
        onSuccessRef.current = onSuccess;
        modeRef.current = mode;
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
                text:
                    mode === 'register' ? 'signup_with' : 'signin_with',
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
        <div className="flex w-full flex-col items-center gap-2">
            {/*
              Google tự chèn button vào đây. Ép mọi div/iframe con giãn hết cỡ để
              nút không bị lệch khỏi khung.
            */}
            <div
                ref={containerRef}
                className="flex min-h-[44px] w-full justify-center [&>div]:!w-full [&_iframe]:!w-full"
            />

            {googleAuth.isPending && (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 size={14} className="animate-spin" />
                    {txt('continue_with_google')}
                </span>
            )}
        </div>
    );
}
