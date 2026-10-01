/**
 * Sao chép ĐÚNG giá trị từ BE (`user/enums/user.enum.ts`).
 * Lệch một chữ là request 400 ngay, nên đừng sửa riêng lẻ bên nào.
 */
export enum User_Role {
    USER = 'USER',
    SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

export enum User_Status {
    ACTIVE = 'ACTIVE',
    BANNED = 'BANNED',
}
