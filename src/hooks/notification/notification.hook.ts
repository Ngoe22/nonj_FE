'use client';

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type InfiniteData,
} from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import type { AppNotification } from '@/types/notification/notification.type';

const PAGE_SIZE = 20;

export const notificationListKey = ['notifications'];
export const unreadCountKey = ['notifications', 'unread-count'];

// ============================================================
// READ
// ============================================================

export function useGetNotifications() {
    return useInfiniteQuery<
        AppNotification[],
        Error,
        InfiniteData<AppNotification[], number>,
        string[],
        number
    >({
        queryKey: notificationListKey,
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `user_notif?page=${pageParam}&limit=${PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= PAGE_SIZE ? allPages.length + 1 : undefined,
        staleTime: 60 * 1000,
    });
}

export function useGetUnreadCount() {
    return useQuery<number>({
        queryKey: unreadCountKey,
        queryFn: async () => {
            const res = await api.get('user_notif/unread-count');
            return res.data.data;
        },
        staleTime: 30 * 1000,
    });
}

// ============================================================
// MARK READ
// ============================================================

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, string>({
        mutationFn: async (notif_id) => {
            await api.patch(`user_notif/${notif_id}/read`);
            return true;
        },
        onSuccess: (_data, notif_id) => {
            // đánh dấu ngay trong cache cho mượt, không chờ refetch
            queryClient.setQueryData<InfiniteData<AppNotification[]>>(
                notificationListKey,
                (old) =>
                    old
                        ? {
                              ...old,
                              pages: old.pages.map((page) =>
                                  page.map((item) =>
                                      item.id === notif_id
                                          ? { ...item, is_read: true }
                                          : item,
                                  ),
                              ),
                          }
                        : old,
            );

            queryClient.setQueryData<number>(unreadCountKey, (count) =>
                Math.max(0, (count ?? 1) - 1),
            );
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, void>({
        mutationFn: async () => {
            await api.patch('user_notif/read-all');
            return true;
        },
        onSuccess: () => {
            queryClient.setQueryData<InfiniteData<AppNotification[]>>(
                notificationListKey,
                (old) =>
                    old
                        ? {
                              ...old,
                              pages: old.pages.map((page) =>
                                  page.map((item) => ({
                                      ...item,
                                      is_read: true,
                                  })),
                              ),
                          }
                        : old,
            );
            queryClient.setQueryData<number>(unreadCountKey, 0);
        },
    });
}
