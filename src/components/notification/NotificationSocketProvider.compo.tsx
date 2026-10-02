'use client';

import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import {
    useQueryClient,
    type InfiniteData,
    type QueryClient,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

import {
    notificationListKey,
    unreadCountKey,
} from '@/hooks/notification/notification.hook';
import { User_Notif_Type } from '@/enum/notification/notification.enum';
import type { AppNotification } from '@/types/notification/notification.type';
import { getBeUrl } from '@/lib/api/beUrl';
import { notificationText } from '@/components/notification/notification.helper';

/**
 * Thông báo vừa tới nghĩa là dữ liệu liên quan đã CŨ.
 *
 * Xoá cache của đúng mục đó để trang đang mở tự nạp lại — trước đây phải F5 mới
 * thấy lời mời kết bạn vừa tới. Dùng tiền tố key nên mọi biến thể của cùng mục
 * đều được làm mới.
 */
function invalidateForNotification(
    queryClient: QueryClient,
    notification: AppNotification,
): void {
    // `content` có hình dạng khác nhau theo từng loại thông báo
    const content = (notification.content ?? {}) as Record<string, string>;
    const { group_id, collection_id, post_id } = content;

    const keys: unknown[][] = [];

    switch (notification.type) {
        case User_Notif_Type.NEW_POST:
            keys.push(['posts', group_id, collection_id]);
            keys.push(['collections', group_id]);
            break;

        case User_Notif_Type.GRADED_POST:
            keys.push(['post', group_id, collection_id, post_id]);
            keys.push(['post_answer_me', group_id, collection_id, post_id]);
            keys.push(['post_answers', group_id, collection_id, post_id]);
            break;

        case User_Notif_Type.GROUP_JOIN_REQUEST:
            keys.push(['join_requests', group_id]);
            break;

        case User_Notif_Type.GROUP_JOIN_APPROVED:
        case User_Notif_Type.GROUP_JOIN_REJECTED:
        case User_Notif_Type.GROUP_MEMBER_KICKED:
            keys.push(['my_all_group']);
            keys.push(['my_own_group']);
            keys.push(['current_group', group_id]);
            break;

        case User_Notif_Type.GROUP_MEMBER_ROLE_CHANGED:
            keys.push(['group_members', group_id]);
            keys.push(['current_group', group_id]);
            break;

        case User_Notif_Type.FRIEND_REQUEST:
            keys.push(['ingoing_friend_requests']);
            break;

        case User_Notif_Type.FRIEND_RESPONSE:
            keys.push(['friends']);
            keys.push(['outgoing_friend_requests']);
            keys.push(['ingoing_friend_requests']);
            break;

        default:
            break;
    }

    keys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
    });
}

/**
 * Mở kết nối WebSocket tới namespace `/notif` của BE và cập nhật cache khi có
 * thông báo mới. Mount MỘT LẦN trong HomeLayout.
 *
 * `withCredentials: true` để trình duyệt gửi cookie `access_token` (HttpOnly)
 * trong handshake — BE xác thực bằng chính cookie đó.
 */
export default function NotificationSocketProvider() {
    const queryClient = useQueryClient();
    const txt = useTranslations('Notification');

    // Giữ translator trong ref: effect bên dưới KHÔNG được phụ thuộc vào nó.
    // Nếu `txt` đổi identity, effect chạy lại và tạo/huỷ socket liên tục.
    const txtRef = useRef(txt);
    useEffect(() => {
        txtRef.current = txt;
    }, [txt]);

    useEffect(() => {
        const baseUrl = getBeUrl();

        const socket: Socket = io(`${baseUrl}/notif`, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            // Kết nối do ta chủ động bật — xem chú thích bên dưới
            autoConnect: false,
        });

        socket.on('notification', (payload: AppNotification) => {
            // chèn lên đầu danh sách
            queryClient.setQueryData<InfiniteData<AppNotification[]>>(
                notificationListKey,
                (old) => {
                    if (!old) return old;
                    const [first = [], ...rest] = old.pages;
                    return { ...old, pages: [[payload, ...first], ...rest] };
                },
            );

            // tăng badge
            queryClient.setQueryData<number>(unreadCountKey, (count) =>
                (count ?? 0) + 1,
            );

            // dữ liệu liên quan đã cũ -> nạp lại, không cần F5
            invalidateForNotification(queryClient, payload);

            toast.info(notificationText(payload, txtRef.current));
        });

        /*
         * Hoãn kết nối một nhịp.
         *
         * React StrictMode ở môi trường dev mount/unmount effect 2 lần. Nếu gọi
         * `connect()` ngay, lần mount đầu bị huỷ GIỮA handshake và trình duyệt
         * báo "WebSocket is closed before the connection is established".
         * Hoãn lại thì lần mount bị huỷ chưa kịp mở kết nối nào.
         */
        const connectTimer = setTimeout(() => socket.connect(), 0);

        return () => {
            clearTimeout(connectTimer);
            socket.disconnect();
        };
    }, [queryClient]);

    return null;
}
