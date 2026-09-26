'use client';

import {InfiniteData, useInfiniteQuery, useQuery} from '@tanstack/react-query';
import axios from 'axios';

import { api } from '@/lib/axios/axios';
import { useTanCreate, useTanDelete } from '@/hooks/_share/tan_crud/tan_crud.hook';
import type {
    SearchGroup,
    OutgoingJoinRequest,
    CreateJoinRequestVars,
    CancelJoinRequestVars,
} from '@/types/group_search/group_search.type';

const NAME_SEARCH_PAGE_SIZE = 8;
const OUTGOING_PAGE_SIZE = 10;

// ============================================================
// SLUG SEARCH — 1 object, không phân trang
// ============================================================
export function useSearchGroupBySlug(slug: string) {
    const trimmed = slug.trim();

    return useQuery<SearchGroup | null>({
        queryKey: ['search_group_slug', trimmed],
        queryFn: async () => {
            try {
                const res = await api.get(
                    `group/slug_search/${encodeURIComponent(trimmed)}`,
                );
                return res.data.data ?? null;
            } catch (error :any) {
                if (error.response?.status === 404) return null;
                throw error;
            }
        },
        enabled: !!trimmed,
        staleTime: 2 * 60 * 1000,
        retry :false
    });
}

// ============================================================
// NAME SEARCH — array + phân trang
// ============================================================
export function useSearchGroupsByName(name: string) {
    const trimmed = name.trim();

    return useInfiniteQuery<SearchGroup[], Error, InfiniteData<SearchGroup[], number>, string[], number>({
        queryKey: ['search_groups_name', trimmed],
        queryFn: async ({ pageParam }) => {
            try {
                const res = await api.get(
                    `group/name_search/${encodeURIComponent(trimmed)}?page=${pageParam}&limit=${NAME_SEARCH_PAGE_SIZE}`,
                );
                return res.data.data;
            } catch (error) {
                // 404 = không có nhóm nào khớp → trả mảng rỗng.
                // KHÔNG được trả `null`: null sẽ lọt vào list và crash lúc render
                // vì `pages.flatMap(p => p)` biến nó thành 1 item null.
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    return [];
                }
                throw error;
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= NAME_SEARCH_PAGE_SIZE
                ? allPages.length + 1
                : undefined,
        enabled: !!trimmed,
        staleTime: 2 * 60 * 1000,
        retry :false
    });
}

// ============================================================
// OUTGOING REQUESTS — infinite
// ============================================================
export function useGetOutgoingRequests() {
    return useInfiniteQuery<OutgoingJoinRequest[], Error, InfiniteData<OutgoingJoinRequest[], number>, string[], number>({
        queryKey: ['outgoing_join_requests'],
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

// ============================================================
// CREATE JOIN REQUEST
// ============================================================
export function useCreateJoinRequest() {
    return useTanCreate<void, CreateJoinRequestVars>({
        mutationFn: async ({ group_id }) => {
            await api.post(`group_join_request/${group_id}`);
        },
        options: {
            onSuccess: {
                invalidateTags: [
                    ['outgoing_join_requests'],
                    ['search_group_slug'],
                    ['search_groups_name'],
                ],
            },
        },
    });
}

// ============================================================
// CANCEL JOIN REQUEST
// ============================================================
export function useCancelJoinRequest() {
    return useTanDelete<OutgoingJoinRequest, CancelJoinRequestVars>({
        mutationFn: async ({ join_request_id }) => {
            await api.delete(`group_join_request/${join_request_id}`);
        },
        getId: (vars) => vars.join_request_id,
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        {
                            tags: [['outgoing_join_requests']],
                            type: 'remove',
                        },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [
                    ['outgoing_join_requests'],
                    ['search_group_slug'],
                    ['search_groups_name'],
                ],
            },
        },
    });
}