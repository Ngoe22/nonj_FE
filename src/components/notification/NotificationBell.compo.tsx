'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';
import { NotificationItem } from '@/components/notification/NotificationItem.compo';
import {
    useGetNotifications,
    useGetUnreadCount,
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
} from '@/hooks/notification/notification.hook';
import {
    notificationHref,
    type AppNotification,
} from '@/types/notification/notification.type';

/** Chuông thông báo + dropdown, đặt ở header (góc phải). */
export default function NotificationBell() {
    const txt = useTranslations('Notification');
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: unreadCount = 0 } = useGetUnreadCount();
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetNotifications();

    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const notifications = data?.pages.flatMap((page) => page) ?? [];

    // đóng khi bấm ra ngoài — đăng ký listener, setState nằm trong callback
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const handleSelect = (notification: AppNotification) => {
        const href = notificationHref(notification);
        setOpen(false);

        /*
         * KHÔNG `await` việc đánh dấu đã đọc.
         *
         * Trước đây await nó trước khi điều hướng, nên chỉ cần API đó lỗi (mạng,
         * thông báo đã đọc ở tab khác…) là `await` ném ra và `router.push` phía
         * dưới KHÔNG BAO GIỜ chạy — bấm thông báo không đi đâu cả.
         */
        if (!notification.is_read) {
            markRead.mutate(notification.id);
        }

        if (href) router.push(href);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={txt('title')}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-hover"
            >
                <Bell size={18} />

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg sm:w-96">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                        <span className="text-sm font-semibold">
                            {txt('title')}
                        </span>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={() => markAllRead.mutate()}
                                disabled={markAllRead.isPending}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
                            >
                                <CheckCheck size={13} />
                                {txt('mark_all_read')}
                            </button>
                        )}
                    </div>

                    {/* Danh sách */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading && (
                            <p className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                                <Loader2 size={14} className="animate-spin" />
                                {txt('loading')}
                            </p>
                        )}

                        {!isLoading && notifications.length === 0 && (
                            <p className="py-10 text-center text-xs text-muted-foreground">
                                {txt('empty')}
                            </p>
                        )}

                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onSelect={handleSelect}
                            />
                        ))}

                        {hasNextPage && (
                            <button
                                type="button"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="w-full border-t border-border px-3 py-2 text-xs text-muted-foreground hover:bg-surface-hover disabled:opacity-50"
                            >
                                {isFetchingNextPage
                                    ? txt('loading')
                                    : txt('load_more')}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
