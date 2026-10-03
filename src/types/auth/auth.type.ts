export interface AuthUserInfo {
    id: string;
    email: string;
    user_name: string | null;
    nickname: string;
    bio: string | null;
    avatar_url: string | null;
    /** BE trả kèm từ label 'me' — FE dùng để gate trang /admin */
    role?: 'USER' | 'SYSTEM_ADMIN';
    /**
     * `true` = đã có mật khẩu (đăng ký bằng email hoặc đã đặt) -> hiện "Đổi mật
     * khẩu". `false` = tài khoản Google chưa đặt mật khẩu -> hiện "Đặt mật khẩu".
     *
     * Optional để tương thích client cũ: không có field này thì coi như `true`
     * (giữ hành vi cũ).
     */
    has_password?: boolean;
}