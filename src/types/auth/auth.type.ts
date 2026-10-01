export interface AuthUserInfo {
    id: string;
    email: string;
    user_name: string | null;
    nickname: string;
    bio: string | null;
    avatar_url: string | null;
    /** BE trả kèm từ label 'me' — FE dùng để gate trang /admin */
    role?: 'USER' | 'SYSTEM_ADMIN';
}