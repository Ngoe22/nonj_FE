import { useTranslations } from 'next-intl';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton.compo';

/**
 * Tab "Đăng ký → Google".
 *
 * Chỉ là phần giới thiệu + nút Google. Nút Google đã tự có khung viền riêng
 * (xem `GoogleLoginButton`) nên ở đây KHÔNG bọc thêm viền nữa — tránh lồng 2
 * khung nhìn rối.
 */
export function GoogleRegister() {
    const txt = useTranslations('Auth');

    return (
        <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-lg font-bold text-foreground">
                G
            </div>

            <h2 className="mt-4 text-base font-semibold text-foreground">
                {txt('register_with_gg')}
            </h2>

            <div className="mt-5">
                <GoogleLoginButton mode="register" />
            </div>
        </div>
    );
}
