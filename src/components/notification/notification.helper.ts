import type { useTranslations } from 'next-intl';

import { User_Notif_Type } from '@/enum/notification/notification.enum';
import type { AppNotification } from '@/types/notification/notification.type';

/** Lấy đúng type của translator cho namespace 'Notification' */
export type NotificationTranslator = ReturnType<
    typeof useTranslations<'Notification'>
>;

/** Câu hiển thị cho từng loại thông báo */
export function notificationText(
    notification: AppNotification,
    txt: NotificationTranslator,
): string {
    switch (notification.type) {
        case User_Notif_Type.NEW_POST: {
            const { title, group_name } = notification.content;
            return txt('text_new_post', {
                title,
                group: group_name ?? '',
            });
        }

        case User_Notif_Type.GRADED_POST: {
            const { title, point, max_point } = notification.content;
            return txt('text_graded_post', {
                title,
                point,
                max: max_point,
            });
        }

        case User_Notif_Type.GROUP_JOIN_APPROVED:
            return txt('text_join_approved', {
                group: notification.content.group_name ?? '',
            });

        case User_Notif_Type.GROUP_JOIN_REJECTED:
            return txt('text_join_rejected', {
                group: notification.content.group_name ?? '',
            });

        case User_Notif_Type.GROUP_JOIN_REQUEST: {
            const { nickname, user_name, group_name } = notification.content;
            return txt('text_join_request', {
                user: nickname || user_name || '',
                group: group_name ?? '',
            });
        }

        case User_Notif_Type.GROUP_MEMBER_KICKED:
            return txt('text_member_kicked', {
                group: notification.content.group_name ?? '',
            });

        case User_Notif_Type.GROUP_MEMBER_ROLE_CHANGED:
            return notification.content.role === 'ADMIN'
                ? txt('text_role_admin', {
                      group: notification.content.group_name ?? '',
                  })
                : txt('text_role_member', {
                      group: notification.content.group_name ?? '',
                  });

        case User_Notif_Type.FRIEND_REQUEST: {
            const { nickname, user_name } = notification.content;
            return txt('text_friend_request', {
                user: nickname || user_name || '',
            });
        }

        case User_Notif_Type.FRIEND_RESPONSE: {
            const { nickname, user_name, accepted } = notification.content;
            return accepted
                ? txt('text_friend_accepted', {
                      user: nickname || user_name || '',
                  })
                : txt('text_friend_rejected', {
                      user: nickname || user_name || '',
                  });
        }

        case User_Notif_Type.REPORT_RESOLVED:
            return txt('text_report_resolved');

        case User_Notif_Type.SUBMISSION:
        case User_Notif_Type.REPORT:
        case User_Notif_Type.SYSTEM:
        default:
            return txt('text_system');
    }
}
