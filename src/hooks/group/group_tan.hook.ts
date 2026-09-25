'use client';

import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios/axios';
import { useRouter } from '@/i18n/navigation';
import {
    useTanCreate,
    useTanDelete,
    useTanGetMany,
    useTanGetOne,
    useTanUpdate,
} from '@/hooks/tan_crud/tan_crud.hook';

import type { CreateGroupFormValues } from '@/schemas/group/group.schema';
import type { Group } from '@/types/group/group.type';

// ============================================================
// GET MANY — joined groups
// ============================================================
export function useGetJoinedGroups() {
    return useTanGetMany<Group>({
        queryKey: ['my_all_group'],
        queryFn: async (page) => {
            const res = await api.get(`group/joined?page=${page}`);
            return res.data.data;
        },
        pageSize: 10,
        staleTime: 15 * 60 * 1000,
    });
}

// ============================================================
// GET MANY — own groups
// ============================================================
export function useGetOwnGroups() {
    return useTanGetMany<Group>({
        queryKey: ['my_own_group'],
        queryFn: async (page) => {
            const res = await api.get(`group/own?page=${page}`);
            return res.data.data;
        },
        pageSize: 10,
        staleTime: 15 * 60 * 1000,
    });
}

// ============================================================
// GET ONE
// ============================================================
export function useGetGroup(groupId: string) {
    return useTanGetOne<Group>({
        queryKey: ['current_group', groupId],
        queryFn: async () => {
            const res = await api.get(`group/id_search/${groupId}`);
            return res.data.data;
        },
        enabled: !!groupId,
        staleTime: 10 * 60 * 1000,
    });
}

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

    return useTanDelete<Group>({
        mutationFn: async (id) => {
            await api.delete(`group/${id}`);
        },
        options: {
            onSuccess: {
                invalidateTags: [['my_own_group'], ['my_all_group']],
                onSuccessCallback: (id) => {
                    queryClient.removeQueries({ queryKey: ['current_group', id] });
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

    return useTanDelete<Group>({
        mutationFn: async (id) => {
            await api.delete(`group_member/quit/${id}`);
        },
        options: {
            onSuccess: {
                invalidateTags: [['my_own_group'], ['my_all_group']],
                onSuccessCallback: (id) => {
                    queryClient.removeQueries({ queryKey: ['current_group', id] });
                    router.push('/group');
                },
            },
        },
    });
}