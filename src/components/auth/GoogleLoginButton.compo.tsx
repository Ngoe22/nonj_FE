'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useGoogleAuth } from '@/hooks/auth/use_google_auth.hook';
import {Loader2} from "lucide-react";

// ✅ Biến module-level — không bao giờ bị reset
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

export function GoogleLoginButton({ mode = 'login', onSuccess }: Props) {
    const txt = useTranslations('Auth');
    const googleAuth = useGoogleAuth();

    const containerRef = useRef<HTMLDivElement>(null);
    const googleAuthRef = useRef(googleAuth);

    // Không gán ref trong lúc render (vi phạm react-hooks/refs) → cập nhật trong effect
    useEffect(() => {
        googleAuthRef.current = googleAuth;
    });

    useEffect(() => {
        const handleCredential = (response: any) => {
            googleAuthRef.current.mutate(
                { credential: response.credential },
                { onSuccess },
            );
        };

        const init = () => {
            // ✅ Dùng biến module-level thay vì useRef
            if (!window.google?.accounts?.id) return false;
            if (isGoogleInitialized) {
                // Nếu đã initialize rồi, chỉ cần render lại button
                if (containerRef.current) {
                    window.google.accounts.id.renderButton(containerRef.current, {
                        theme: 'outline',
                        size: 'large',
                        width: 400,
                        text: mode === 'register' ? 'signup_with' : 'signin_with',
                        locale: 'vi',
                    });
                }
                return true;
            }

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleCredential,
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            if (containerRef.current) {
                window.google.accounts.id.renderButton(containerRef.current, {
                    theme: 'outline',
                    size: 'large',
                    width: 400,
                    text: mode === 'register' ? 'signup_with' : 'signin_with',
                    locale: 'vi',
                });
            }

            isGoogleInitialized = true; // ✅ Đánh dấu toàn cục
            return true;
        };

        if (!init()) {
            const interval = setInterval(() => {
                if (init()) clearInterval(interval);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [mode]);

    return (
        <div className="relative w-full">
            {/* ============ NÚT CUSTOM (visual) ============ */}
            <button
                type="button"
                disabled={googleAuth.isPending}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-hover disabled:opacity-50"
            >
                {/* Google icon SVG inline */}
                <GoogleIcon />

                {googleAuth.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <span>
            {mode === 'register'
                ? txt('continue_with_google_register')
                : txt('continue_with_google')}
          </span>
                )}
            </button>

            {/* ============ NÚT GOOGLE THẬT (ẩn) ============ */}
            {/* Phủ lên trên, opacity 0 → click vào là click Google */}
            <div
                ref={containerRef}
                aria-hidden="true"
                className="absolute inset-0 cursor-pointer opacity-0 [&_iframe]:!h-full [&_iframe]:!w-full [&>div]:!h-full [&>div]:!w-full"
            />
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