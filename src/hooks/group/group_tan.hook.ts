'use client';

import { useRef } from 'react';

import {InfiniteData, useInfiniteQuery, useQuery, useQueryClient} from '@tanstack/react-query';
import { clearGroupCache } from '@/helper/tanstack/groupCache.helper';
import { api } from '@/lib/axios/axios';
import { useRouter } from '@/i18n/navigation';
import {
    useTanCreate,
    useTanDelete,
    useTanUpdate,
} from '@/hooks/_share/tan_crud/tan_crud.hook';

import type { CreateGroupFormValues } from '@/schemas/group/group.schema';
import type { Group } from '@/types/group/group.type';
import type {GroupMember} from "@/types/group/group_member.type";


const PAGE_SIZE = 10;

// ============================================================
// GET MANY — own groups
// ============================================================

export function useGetJoinedGroups() {
    return useInfiniteQuery<Group[], Error, InfiniteData<Group[], number>, string[], number>({
        queryKey: ['my_all_group'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(`group/joined?page=${pageParam}`);
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= PAGE_SIZE ? allPages.length + 1 : undefined,
        staleTime: 15 * 60 * 1000,
    });
}

export function useGetOwnGroups() {
    return useInfiniteQuery<Group[], Error, InfiniteData<Group[], number>, string[], number>({
        queryKey: ['my_own_group'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(`group/own?page=${pageParam}`);
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= PAGE_SIZE ? allPages.length + 1 : undefined,
        staleTime: 15 * 60 * 1000,
    });
}

// ============================================================
// GET ONE — dùng trực tiếp useQuery
// ============================================================
export function useGetGroup(groupId: string) {
    return useQuery<Group>({
        queryKey: ['current_group', groupId],
        queryFn: async () => {
            const res = await api.get(`group/id_search/${groupId}`);
            return res.data.data;
        },
        enabled: !!groupId,
        staleTime: 10 * 60 * 1000,
    });
}








// ======================================================



// ============================================================
// CREATE
// ============================================================
export function useCreateGroup() {
    return useTanCreate<Group, CreateGroupFormValues>({
        mutationFn: async (body) => {
            const res = await api.post<{ data: Group }>('group', body);
            return res.data.data;
        },
        options: {
            onSuccess: {
                optimisticUI: {
                    page: [
                        { tags: [['my_own_group'], ['my_all_group']], type: 'add' },
                    ],
                },
                invalidateTags: [['my_own_group'], ['my_all_group']],
            },
        },
    });
}

// ============================================================
// UPDATE — cần groupId cho current_group key
// ============================================================
export function useUpdateGroup(groupId: string) {
    return useTanUpdate<Group>({
        mutationFn: async ({ id, body }) => {
            const res = await api.patch<{ data: Group }>(`group/${id}`, body);
            return res.data.data;
        },
        options: {
            onMutate: {
                optimisticUI: {
                    one: { tags: [['current_group', groupId]] },
                    page: [
                        {
                            tags: [['my_own_group'], ['my_all_group']],
                            type: 'update',
                        },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [
                    ['current_group', groupId],
                    ['my_own_group'],
                    ['my_all_group'],
                ],
            },
        },
    });
}

// ============================================================
// DELETE
// ============================================================
export function useDeleteGroup() {
    const router = useRouter();
    const queryClient = useQueryClient();

    /**
     * `onSuccessCallback` nhận RESPONSE của BE, KHÔNG phải id truyền vào — nên
     * không thể dùng tham số đó làm group_id. Ghi lại id ngay trong mutationFn.
     */
    const deletedId = useRef('');

    return useTanDelete<Group>({
        mutationFn: async (id: string) => {
            deletedId.current = id;
            await api.delete(`group/${id}`);
        },
        options: {
            onSuccess: {
                invalidateTags: [['my_own_group'], ['my_all_group']],
                onSuccessCallback: () => {
                    clearGroupCache(queryClient, deletedId.current);
                    router.push('/group');
                },
            },
        },
    });
}

// ============================================================
// QUIT
// ============================================================
export function useQuitGroup() {
    const router = useRouter();
    const queryClient = useQueryClient();

    /** Xem giải thích ở `useDeleteGroup` */
    const quitId = useRef('');

    return useTanDelete<Group>({
        mutationFn: async (id: string) => {
            quitId.current = id;
            await api.delete(`group_member/quit/${id}`);
        },
        options: {
            onSuccess: {
                invalidateTags: [['my_own_group'], ['my_all_group']],
                onSuccessCallback: () => {
                    clearGroupCache(queryClient, quitId.current);
                    router.push('/group');
                },
            },
        },
    });
}