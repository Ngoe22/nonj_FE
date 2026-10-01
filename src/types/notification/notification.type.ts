import { User_Notif_Type } from '@/enum/notification/notification.enum';

// ============================================================
// Shape `content` theo từng loại — khớp những gì BE ghi vào jsonb
// ============================================================

export interface NewPostContent {
    group_id: string;
    group_name?: string;
    collection_id: string;
    post_id: string;
    title: string;
}

export interface GradedPostContent extends NewPostContent {
    point: number;
    max_point: number;
}

export interface GroupContent {
    group_id: string;
    group_name?: string;
}

export interface GroupJoinRequestContent extends GroupContent {
    join_request_id: string;
    user_id: string;
    user_name?: string;
    nickname?: string;
    avatar_url?: string | null;
}

export interface GroupRoleChangedContent extends GroupContent {
    role: 'ADMIN' | 'MEMBER' | 'FOUNDER';
}

export interface FriendContent {
    request_id: string;
    user_id: string;
    user_name?: string;
    nickname?: string;
    avatar_url?: string | null;
    accepted?: boolean | null;
}

export interface ReportResolvedContent {
    report_id: string;
    status?: string | null;
    action_taken?: string | null;
    target_type?: string;
    target_id?: string;
}

/** Union theo `type` để render + điều hướng được kiểm tra đầy đủ */
export type NotificationPayload =
    | { type: User_Notif_Type.NEW_POST; content: NewPostContent }
    | { type: User_Notif_Type.GRADED_POST; content: GradedPostContent }
    | { type: User_Notif_Type.GROUP_JOIN_APPROVED; content: GroupContent }
    | { type: User_Notif_Type.GROUP_JOIN_REJECTED; content: GroupContent }
    | {
          type: User_Notif_Type.GROUP_JOIN_REQUEST;
          content: GroupJoinRequestContent;
      }
    | { type: User_Notif_Type.GROUP_MEMBER_KICKED; content: GroupContent }
    | {
          type: User_Notif_Type.GROUP_MEMBER_ROLE_CHANGED;
          content: GroupRoleChangedContent;
      }
    | { type: User_Notif_Type.FRIEND_REQUEST; content: FriendContent }
    | { type: User_Notif_Type.FRIEND_RESPONSE; content: FriendContent }
    | { type: User_Notif_Type.REPORT_RESOLVED; content: ReportResolvedContent }
    // các loại chưa có shape riêng -> dùng chung content mở
    | {
          type:
              | User_Notif_Type.SUBMISSION
              | User_Notif_Type.REPORT
              | User_Notif_Type.SYSTEM;
          content: Record<string, unknown>;
      };

export type AppNotification = {
    id: string;
    is_read: boolean;
    created_at: string;
} & NotificationPayload;

/**
 * Đích điều hướng khi bấm vào thông báo.
 * Trả `null` nếu thông báo không gắn với trang nào.
 */
export function notificationHref(
    notification: AppNotification,
): string | null {
    switch (notification.type) {
        case User_Notif_Type.NEW_POST:
        case User_Notif_Type.GRADED_POST: {
            const { group_id, collection_id, post_id } = notification.content;
            return `/group/${group_id}/collection/${collection_id}/post/${post_id}`;
        }

        case User_Notif_Type.GROUP_JOIN_APPROVED:
        case User_Notif_Type.GROUP_JOIN_REJECTED:
            return `/group/${notification.content.group_id}`;

        case User_Notif_Type.GROUP_MEMBER_KICKED:
        case User_Notif_Type.GROUP_MEMBER_ROLE_CHANGED:
            // đổi vai trò / bị mời ra -> xem danh sách thành viên
            return `/group/${notification.content.group_id}?view=members`;

        case User_Notif_Type.GROUP_JOIN_REQUEST:
            // người duyệt cần vào thẳng tab đơn xin vào nhóm
            return `/group/${notification.content.group_id}?view=join_requests`;

        case User_Notif_Type.FRIEND_REQUEST:
            // mở đúng tab "lời mời đến", không bắt người dùng tự chuyển tab
            return '/friends?tab=incoming';

        case User_Notif_Type.FRIEND_RESPONSE:
            return '/friends?tab=outgoing';

        default:
            return null;
    }
}
