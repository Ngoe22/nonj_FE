'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import {
    OUTGOING_JOIN_REQUESTS_TAG,
    OUTGOING_PAGE_SIZE,
} from '@/hooks/group_search/group_search.const';
import type { OutgoingJoinRequest } from '@/types/group_search/group_search.type';

// ============================================================
// OUTGOING REQUESTS — array + phân trang
// ============================================================
export function useGetOutgoingRequests() {
    return useInfiniteQuery<OutgoingJoinRequest[], Error, InfiniteData<OutgoingJoinRequest[], number>, string[], number>({
        queryKey: OUTGOING_JOIN_REQUESTS_TAG,
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `group_join_request/user/me?page=${pageParam}&limit=${OUTGOING_PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= OUTGOING_PAGE_SIZE
                ? allPages.length + 1
                : undefined,
        staleTime: 2 * 60 * 1000,
    });
}
