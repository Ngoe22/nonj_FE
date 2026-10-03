'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

import { useGoogleAuth } from '@/hooks/auth/use_google_auth.hook';

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
    const locale = useLocale();   // ⬅️ Sync locale với next-intl
    const googleAuth = useGoogleAuth();

    const containerRef = useRef<HTMLDivElement>(null);
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
                    use_fedcm_for_prompt: false,   // ⬅️ THÊM
                });

                // ✅ Ép Google reset → luôn "Sign in with Google"
                window.google.accounts.id.disableAutoSelect();

                isGoogleInitialized = true;
            }

            // ✅ Set width theo container, cap 400px
            const containerWidth = containerRef.current.offsetWidth || 400;
            const btnWidth = Math.min(400, Math.max(200, containerWidth));

            window.google.accounts.id.renderButton(containerRef.current, {
                type: 'standard',
                theme: 'filled_black',
                size: 'large',
                shape: 'rectangular',
                logo_alignment: 'left',
                locale: locale,   // ⬅️ Dùng locale từ next-intl
                text: mode === 'register' ? 'signup_with' : 'signin_with',
                width: btnWidth,  // ⬅️ Google set iframe width
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
    }, [mode, locale]);

    const pending = googleAuth.isPending;

    return (
        <div className="w-full rounded-2xl border border-border bg-surface/40 px-5 py-5">
            <div className="flex flex-col items-center gap-3">
                {/* Container có width cụ thể — Google đọc offsetWidth */}
                <div
                    ref={containerRef}
                    className="flex min-h-[44px] w-full justify-center"
                />

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



// 'use client';


//
// import { useEffect, useRef } from 'react';
// import { useTranslations } from 'next-intl';
// import { Loader2 } from 'lucide-react';
//
// import { useGoogleAuth } from '@/hooks/auth/use_google_auth.hook';
//
// /** Biến module-level — không bao giờ bị reset giữa các lần mount */
// let isGoogleInitialized = false;
//
// declare global {
//     interface Window {
//         google?: any;
//     }
// }
//
// interface Props {
//     mode?: 'login' | 'register';
//     onSuccess?: () => void;
// }
//
// /**
//  * Nút "Tiếp tục với Google".
//  *
//  * Dùng NÚT CHÍNH CHỦ của Google (`renderButton` — Google tự vẽ nút thật). KHÔNG
//  * hack overlay/pointer-events gì cả: cách hack đó đã làm mất nút Google trong
//  * DOM và bấm không phản ứng, nên bỏ.
//  *
//  * Google tự vẽ nút (kể cả trạng thái "Đăng nhập với tên …" khi đã có phiên),
//  * vừa đúng chuẩn thương hiệu, vừa chắc chắn bấm được.
//  */
// export function GoogleLoginButton({ mode = 'login', onSuccess }: Props) {
//     const txt = useTranslations('Auth');
//     const googleAuth = useGoogleAuth();
//
//     const containerRef = useRef<HTMLDivElement>(null);
//     // Giữ bản mới nhất để callback của Google không bị "đóng băng" giá trị cũ
//     const googleAuthRef = useRef(googleAuth);
//     const onSuccessRef = useRef(onSuccess);
//
//     useEffect(() => {
//         googleAuthRef.current = googleAuth;
//         onSuccessRef.current = onSuccess;
//     });
//
//     useEffect(() => {
//         let cancelled = false;
//
//         const render = (): boolean => {
//             if (!window.google?.accounts?.id || !containerRef.current) {
//                 return false;
//             }
//
//             if (!isGoogleInitialized) {
//                 window.google.accounts.id.initialize({
//                     client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//                     callback: (response: { credential?: string }) => {
//                         if (!response?.credential) return;
//                         googleAuthRef.current.mutate(
//                             { credential: response.credential },
//                             { onSuccess: onSuccessRef.current },
//                         );
//                     },
//                     auto_select: false,
//                     cancel_on_tap_outside: true,
//                 });
//                 isGoogleInitialized = true;
//             }
//
//             window.google.accounts.id.renderButton(containerRef.current, {
//                 type: 'standard',
//                 // hợp với nền tối của app
//                 theme: 'filled_black',
//                 size: 'large',
//                 shape: 'rectangular',
//                 logo_alignment: 'left',
//                 locale: 'vi',
//                 text: mode === 'register' ? 'signup_with' : 'signin_with',
//             });
//
//             return true;
//         };
//
//         if (!render()) {
//             const interval = setInterval(() => {
//                 if (cancelled) return;
//                 if (render()) clearInterval(interval);
//             }, 100);
//             return () => {
//                 cancelled = true;
//                 clearInterval(interval);
//             };
//         }
//     }, [mode]);
//
//     const pending = googleAuth.isPending;
//
//     return (
//         // Khung trang trí bao quanh nút Google
//         <div className="w-full rounded-2xl border border-border bg-surface/40 px-5 py-5">
//             <div className="flex flex-col items-center gap-3">
//                 {/* Google tự chèn nút CHÍNH CHỦ vào đây — căn giữa */}
//                 <div
//                     ref={containerRef}
//                     className="flex min-h-[44px] w-full justify-center [&>div]:!w-full [&_iframe]:!w-full"
//                 />
//
//                 {/* Dòng gợi ý bên dưới — luôn hiển thị, đổi thành spinner khi đang xử lý */}
//                 <p className="flex items-center gap-2 text-center text-xs text-muted-foreground">
//                     {pending && <Loader2 size={14} className="animate-spin" />}
//                     {pending
//                         ? txt('continue_with_google')
//                         : mode === 'register'
//                           ? txt('google_register_hint')
//                           : txt('google_login_hint')}
//                 </p>
//             </div>
//         </div>
//     );
// }
