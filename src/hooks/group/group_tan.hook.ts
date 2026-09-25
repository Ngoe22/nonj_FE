'use client';

import {useInfiniteQuery, useQuery, useQueryClient} from '@tanstack/react-query';
import { api } from '@/lib/axios/axios';
import { useRouter } from '@/i18n/navigation';
import {
    useTanCreate,
    useTanDelete,
    useTanUpdate,
} from '@/hooks/_share/tan_crud/tan_crud.hook';

import type { CreateGroupFormValues } from '@/schemas/group/group.schema';
import type { Group } from '@/types/group/group.type';


let PAGE_SIZE  = 10;

// ============================================================
// GET MANY — own groups
// ============================================================

export function useGetJoinedGroups() {
    return useInfiniteQuery<Group[], Error, any, string[], number>({
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
    return useInfiniteQuery<Group[], Error, any, string[], number>({
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