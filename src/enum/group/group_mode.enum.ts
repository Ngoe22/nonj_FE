export enum Group_Join_Mode {
    BY_REQUEST = 'BY_REQUEST',
    PUBLIC = 'PUBLIC',
}

export enum Group_View_Mode {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC',
}
/** Sao chép đúng giá trị từ BE (`group/enum/group.enum.ts`) */
export enum Group_Join_Request_Status {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
}

/** Trạng thái admin/người duyệt CÓ THỂ đặt (chỉ từ chối hoặc chấp thuận) */
export enum Group_Join_Request_Status_UPDATE {
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
}
