'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import type {
    AdminCollection,
    AdminGroup,
    AdminPost,
    AdminPreparationCollection,
    AdminReport,
    AdminUser,
} from '@/types/admin/admin.type';

const PAGE_SIZE = 20;

/** Lấy mảng thuần từ BE (TransformInterceptor bọc trong .data.data) */
async function getList<T>(url: string): Promise<T[]> {
    const res = await api.get<{ data: T[] }>(url);
    return res.data.data;
}

async function getOne<T>(url: string): Promise<T> {
    const res = await api.get<{ data: T }>(url);
    return res.data.data;
}

// ============================================================
// USERS
// ============================================================

export function useAdminUsers(page: number) {
    return useQuery<AdminUser[]>({
        queryKey: ['admin', 'users', page],
        queryFn: () =>
            getList<AdminUser>(
                `admin/users?page=${page}&limit=${PAGE_SIZE}`,
            ),
    });
}

export function useAdminUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation<
        AdminUser,
        Error,
        {
            user_id: string;
            body: Partial<
                Pick<AdminUser, 'nickname' | 'bio' | 'status' | 'avatar_url'>
            >;
        }
    >({
        mutationFn: async ({ user_id, body }) => {
            const res = await api.patch<{ data: AdminUser }>(
                `admin/users/${user_id}`,
                body,
            );
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
}

/** Bộ sưu tập ĐỀ CÁ NHÂN của một user */
export function useAdminUserCollections(userId: string, enabled: boolean) {
    return useQuery<AdminPreparationCollection[]>({
        queryKey: ['admin', 'user-collections', userId],
        queryFn: () =>
            getList<AdminPreparationCollection>(
                `admin/question_preparation_collection/user/${userId}`,
            ),
        enabled: enabled && !!userId,
    });
}

/** Các đề trong một bộ sưu tập cá nhân */
export function useAdminCollectionPreparations(
    userId: string,
    collectionId: string,
    enabled: boolean,
) {
    return useQuery<AdminPost[]>({
        queryKey: [
            'admin',
            'user-collection-preparations',
            userId,
            collectionId,
        ],
        queryFn: () =>
            getList<AdminPost>(
                `admin/question_preparation/users/${userId}/${collectionId}`,
            ),
        enabled: enabled && !!userId && !!collectionId,
    });
}

// ============================================================
// GROUPS
// ============================================================

export function useAdminGroups(page: number) {
    return useQuery<AdminGroup[]>({
        queryKey: ['admin', 'groups', page],
        queryFn: () =>
            getList<AdminGroup>(
                `admin/group/many?page=${page}&limit=${PAGE_SIZE}`,
            ),
    });
}

export function useAdminUpdateGroup() {
    const queryClient = useQueryClient();

    return useMutation<
        boolean,
        Error,
        {
            group_id: string;
            body: Partial<
                Pick<
                    AdminGroup,
                    'name' | 'description' | 'join_mode' | 'view_mode'
                >
            >;
        }
    >({
        mutationFn: async ({ group_id, body }) => {
            const res = await api.patch<{ data: boolean }>(
                `admin/group/${group_id}`,
                body,
            );
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] });
        },
    });
}

export function useAdminDeleteGroup() {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, string>({
        mutationFn: async (group_id) => {
            const res = await api.delete<{ data: boolean }>(
                `admin/group/${group_id}`,
            );
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] });
        },
    });
}

/** Bộ sưu tập bài tập của một nhóm */
export function useAdminGroupCollections(groupId: string, enabled: boolean) {
    return useQuery<AdminCollection[]>({
        queryKey: ['admin', 'group-collections', groupId],
        queryFn: () =>
            getList<AdminCollection>(
                `admin/post_collection/group/${groupId}?page=1&limit=100`,
            ),
        enabled: enabled && !!groupId,
    });
}

export function useAdminCollection(collectionId: string, enabled: boolean) {
    return useQuery<AdminCollection>({
        queryKey: ['admin', 'collection', collectionId],
        queryFn: () =>
            getOne<AdminCollection>(`admin/post_collection/${collectionId}`),
        enabled: enabled && !!collectionId,
    });
}

export function useAdminDeleteCollection() {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, string>({
        mutationFn: async (collection_id) => {
            const res = await api.delete<{ data: boolean }>(
                `admin/post_collection/${collection_id}`,
            );
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['admin', 'group-collections'],
            });
        },
    });
}

// ============================================================
// POSTS
// ============================================================

export function useAdminCollectionPosts(
    collectionId: string,
    page: number,
    enabled: boolean,
) {
    return useQuery<AdminPost[]>({
        queryKey: ['admin', 'posts', collectionId, page],
        queryFn: () =>
            getList<AdminPost>(
                `admin/post/collection/${collectionId}?page=${page}&limit=${PAGE_SIZE}`,
            ),
        enabled: enabled && !!collectionId,
    });
}

export function useAdminUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation<
        boolean,
        Error,
        {
            post_id: string;
            body: Partial<Pick<AdminPost, 'title' | 'description'>>;
        }
    >({
        mutationFn: async ({ post_id, body }) => {
            const res = await api.patch<{ data: boolean }>(
                `admin/post/${post_id}`,
                body,
            );
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
        },
    });
}

export function useAdminDeletePost() {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, string>({
        mutationFn: async (post_id) => {
            const res = await api.delete<{ data: boolean }>(
                `admin/post/${post_id}`,
            );
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
        },
    });
}

// ============================================================
// REPORTS
// ============================================================

export function useAdminReports(page: number, status?: string) {
    const query = status ? `&status=${status}` : '';
    return useQuery<AdminReport[]>({
        queryKey: ['admin', 'reports', page, status ?? 'ALL'],
        queryFn: () =>
            getList<AdminReport>(
                `admin/report?page=${page}&limit=${PAGE_SIZE}${query}`,
            ),
    });
}

export function useAdminReviewReport() {
    const queryClient = useQueryClient();

    return useMutation<
        boolean,
        Error,
        {
            report_id: string;
            body: {
                status: string;
                action_taken: string;
                review_note?: string;
            };
        }
    >({
        mutationFn: async ({ report_id, body }) => {
            const res = await api.patch<{ data: boolean }>(
                `admin/report/${report_id}/review`,
                body,
            );
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
        },
    });
}
