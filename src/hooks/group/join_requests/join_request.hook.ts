'use client';

import { api } from '@/lib/axios/axios';
import {
    useTanUpdate,
} from '@/hooks/_share/tan_crud/tan_crud.hook';
import type {
    JoinRequest,
    UpdateJoinRequestVars,
} from '@/types/group/join_request.type';
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

// ============================================================
// GET MANY —
// ============================================================
export function useGetGroupJoinRequests(groupId: string) {
    return useInfiniteQuery<JoinRequest[], Error, InfiniteData<JoinRequest[], number>, string[], number>({
        queryKey: ['join_requests', groupId],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `group_join_request/group/${groupId}?page=${pageParam}&limit=${PAGE_SIZE}`,
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
// UPDATE — approve / reject
// ============================================================
export function useUpdateJoinRequest(groupId: string) {
    return useTanUpdate<JoinRequest>({
        mutationFn: async ({ group_id, user_id, join_request_id, body }) => {
            const res = await api.patch<{ data: JoinRequest }>(
                `group_join_request/${group_id}/${user_id}/${join_request_id}`,
                body,
            );
            return res.data.data;
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        {
                            tags: [['join_requests', groupId]],
                            type: 'remove',
                        },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [['join_requests', groupId] , ['group_members',groupId]],
            },
        },
    });
}