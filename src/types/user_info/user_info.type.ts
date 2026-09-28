/**
 * Shape tối thiểu mà mọi component `UserInfo` cần.
 * Bất kỳ object nào có đủ 4 field này đều dùng được.
 */
export interface BasicUser {
    id: string;
    user_name: string;
    nickname: string;
    avatar_url: string | null;
    bio?: string | null;
}

export interface UserWithBio extends BasicUser {
    bio?: string | null;
}