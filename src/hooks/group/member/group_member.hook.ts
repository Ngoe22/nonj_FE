'use client';

import {InfiniteData, useInfiniteQuery} from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import { useTanUpdate, useTanDelete } from '@/hooks/_share/tan_crud/tan_crud.hook';
import type {
    GroupMember,
    UpdateGroupMemberVars,
    KickGroupMemberVars,
} from '@/types/group/group_member.type';

const PAGE_SIZE = 10;

// ============================================================
// GET MANY — infinite scroll
// ============================================================
export function useGetGroupMembers(groupId: string) {
    return useInfiniteQuery<GroupMember[], Error, InfiniteData<GroupMember[], number>, string[], number>({
        queryKey: ['group_members', groupId],
        queryFn: async ({ pageParam })  => {
            const res = await api.get(
                `group_member/${groupId}?page=${pageParam}&limit=${PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= PAGE_SIZE ? allPages.length + 1 : undefined,
        enabled: !!groupId,
        staleTime: 5 * 60 * 1000,
    });
}

// ============================================================
// UPDATE — promote / demote / remove admin
// ============================================================
export function useUpdateGroupMember(groupId: string) {
    return useTanUpdate<GroupMember, UpdateGroupMemberVars>({
        mutationFn: async ({ group_id, target_id, action }) => {
            const res = await api.patch<{ data: GroupMember }>(
                `group_member/${group_id}/${target_id}`,
                { action },
            );
            return res.data.data;
        },
        getId: (vars) => vars.target_id,
        options: {

            onSuccess: {
                invalidateTags: [['group_members', groupId]],
            },
        },
    });
}

// ============================================================
// DELETE — kick member
// ============================================================
export function useKickGroupMember(groupId: string) {
    return useTanDelete<GroupMember, KickGroupMemberVars>({
        mutationFn: async ({ group_id, user_id }) => {
            await api.delete(`group_member/kick/${group_id}/${user_id}`);
        },
        getId: (vars) => vars.member_id,
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        {
                            tags: [['group_members', groupId]],
                            type: 'remove',
                        },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [['group_members', groupId]],
            },
        },
    });
}