'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

import { useGoogleAuth } from '@/hooks/auth/use_google_auth.hook';

/** Biến module-level — không bao giờ bị reset giữa các lần mount */
let isGoogleInitialized = false;

/**
 * Bề rộng nút Google (px).
 *
 * Google vẽ nút theo `width` CỐ ĐỊNH bên trong iframe, KHÔNG giãn theo CSS.
 * Nên khung chứa phải đúng bề rộng này thì nút mới khớp và căn giữa được.
 *
 * Khai báo ở MODULE level (không phải trong component) để dùng được cả trong
 * `useEffect` lẫn JSX — để trong component thì React Compiler báo
 * "accessed before it is declared".
 */
const BUTTON_WIDTH = 320;

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
                text: mode === 'register' ? 'signup_with' : 'signin_with',
                width: BUTTON_WIDTH,
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

    const pending = googleAuth.isPending;

    const label =
        mode === 'register'
            ? txt('continue_with_google_register')
            : txt('continue_with_google');

    return (
        // Khung viền bao ngoài, nút căn GIỮA bên trong
        <div className="w-full rounded-2xl border border-border bg-surface/40 px-5 py-5">
            <div className="flex flex-col items-center gap-3">
                <div
                    className="relative"
                    style={{ width: BUTTON_WIDTH, maxWidth: '100%' }}
                >
                    {/*
                      NÚT CUSTOM — chỉ để NHÌN.

                      `pointer-events-none` là mấu chốt: mọi cú click XUYÊN QUA nút
                      này xuống nút Google thật ở dưới. Nhờ vậy giữ được giao diện
                      riêng mà vẫn dùng đúng luồng của Google.
                      `aria-hidden` + `tabIndex={-1}` để trình đọc màn hình và phím
                      Tab không dừng ở nút "giả" này (nút thật nằm ngay trên).
                    */}
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-hidden="true"
                        className="pointer-events-none flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-foreground"
                    >
                        <GoogleIcon />
                        <span>{label}</span>
                    </button>

                    {/*
                      NÚT GOOGLE THẬT — trong suốt, phủ LÊN TRÊN nút custom.
                      Cùng khung (absolute inset-0) + cùng bề rộng với nút Google
                      được vẽ (`width: BUTTON_WIDTH`) nên bấm chỗ nào cũng trúng.
                      Trong lúc gửi request thì tắt pointer-events để không bấm lại.
                    */}
                    <div
                        ref={containerRef}
                        className={[
                            'absolute inset-0 z-10 overflow-hidden rounded-xl opacity-0',
                            '[&>div]:!h-full [&>div]:!w-full',
                            '[&_iframe]:!h-full [&_iframe]:!w-full',
                            pending ? 'pointer-events-none' : 'cursor-pointer',
                        ].join(' ')}
                    />
                </div>

                {/* Dòng gợi ý nhỏ bên dưới nút */}
                <p className="flex items-center gap-2 text-center text-xs text-muted-foreground">
                    {pending && <Loader2 size={14} className="animate-spin" />}
                    {pending
                        ? txt('continue_with_google')
                        : mode === 'register'
                          ? txt('google_register_hint')
                          : txt('google_login_hint')}
                </p>
            </div>
        </div>
    );
}

// ============================================================
// Google logo SVG (chính chủ)
// ============================================================
function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62z"
            />
            <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.33A9 9 0 0 0 9 18z"
            />
            <path
                fill="#FBBC05"
                d="M3.95 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l2.99-2.33z"
            />
            <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 .96 4.96l2.99 2.33C4.66 5.16 6.65 3.58 9 3.58z"
            />
        </svg>
    );
}
