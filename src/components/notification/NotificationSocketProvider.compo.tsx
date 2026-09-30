'use client';

import { useEffect } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

import {
    notificationListKey,
    unreadCountKey,
} from '@/hooks/notification/notification.hook';
import type { AppNotification } from '@/types/notification/notification.type';
import { notificationText } from '@/components/notification/notification.helper';

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

    useEffect(() => {
        const baseUrl =
            process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

        const socket: Socket = io(`${baseUrl}/notif`, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });

        socket.on('notification', (payload: AppNotification) => {
            // chèn lên đầu danh sách
            queryClient.setQueryData<InfiniteData<AppNotification[]>>(
                notificationListKey,
                (old) => {
                    if (!old) return old;
                    const [first = [], ...rest] = old.pages;
                    return {
                        ...old,
                        pages: [[payload, ...first], ...rest],
                    };
                },
            );

            // tăng badge
            queryClient.setQueryData<number>(unreadCountKey, (count) =>
                (count ?? 0) + 1,
            );

            toast.info(notificationText(payload, txt));
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient, txt]);

    return null;
}
