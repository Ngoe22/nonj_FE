'use client';

import {InfiniteData, useInfiniteQuery, useQuery} from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import {
    useTanCreate,
    useTanDelete,
    useTanUpdate,
} from '@/hooks/_share/tan_crud/tan_crud.hook';

import type {
    Friendship,
    SearchUserResult,
    OutgoingFriendRequest,
    IngoingFriendRequest,
    AddFriendVars,
    CancelFriendRequestVars,
    UpdateFriendRequestVars,
    UnfriendVars,
} from '@/types/friend/friend.type';
import type {Group} from "@/types/group/group.type";

const PAGE_SIZE = 20;

// ============================================================
// SEARCH USER — 1 kết quả (unique username)
// ============================================================
export function useSearchUser(userName: string) {
    const trimmed = userName.trim();

    return useQuery<SearchUserResult | null>({
        queryKey: ['search_user', trimmed],
        queryFn: async () => {
            const res = await api.get(
                `user/search/${encodeURIComponent(trimmed)}`,
            );
            return res.data.data ?? null;
        },
        enabled: !!trimmed,
        staleTime: 30 * 1000,
    });
}

// ============================================================
// FRIENDS LIST
// ============================================================
export function useGetFriends() {
    return useInfiniteQuery<
        Friendship[],
        Error,
        InfiniteData<Friendship[], number>,
        string[],
        number
    >({
        queryKey: ['friends'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `friendship?page=${pageParam}&limit=${PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= PAGE_SIZE ? allPages.length + 1 : undefined,
        staleTime: 2 * 60 * 1000,
    });
}

// ============================================================
// OUTGOING REQUESTS
// ============================================================
export function useGetOutgoingFriendRequests() {
    return useInfiniteQuery<
        OutgoingFriendRequest[],
        Error,
        InfiniteData<OutgoingFriendRequest[], number>,
        string[],
        number
    >({
        queryKey: ['outgoing_friend_requests'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `friend_request/outgoing_requests?page=${pageParam}&limit=${PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= PAGE_SIZE ? allPages.length + 1 : undefined,
        staleTime: 2 * 60 * 1000,
    });
}

// ============================================================
// INGOING REQUESTS
// ============================================================
export function useGetIngoingFriendRequests() {
    return useInfiniteQuery<
        IngoingFriendRequest[],
        Error,
        InfiniteData<IngoingFriendRequest[], number>,
        string[],
        number
    >({
        queryKey: ['ingoing_friend_requests'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `friend_request/ingoing_requests?page=${pageParam}&limit=${PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= PAGE_SIZE ? allPages.length + 1 : undefined,
        staleTime: 2 * 60 * 1000,
    });
}

// ============================================================
// ADD FRIEND — POST /friend_request/:receiver_id
// ============================================================
export function useAddFriend() {
    return useTanCreate<void, AddFriendVars>({
        mutationFn: async ({ receiver_id }) => {
            await api.post(`friend_request/${receiver_id}`);
        },
        options: {
            onSuccess: {
                invalidateTags: [
                    ['search_user'],
                    ['outgoing_friend_requests'],
                ],
            },
        },
    });
}

// ============================================================
// CANCEL OUTGOING REQUEST — DELETE /friend_request/:request_id
// ============================================================
export function useCancelFriendRequest() {
    return useTanDelete<OutgoingFriendRequest, CancelFriendRequestVars>({
        mutationFn: async ({ request_id }) => {
            await api.delete(`friend_request/${request_id}`);
        },
        getId: (vars) => vars.request_id,
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        {
                            tags: [['outgoing_friend_requests']],
                            type: 'remove',
                        },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [
                    ['outgoing_friend_requests'],
                    ['search_user'],
                ],
            },
        },
    });
}

// ============================================================
// ACCEPT / REJECT — PATCH /friend_request/:request_id
// ============================================================
export function useUpdateFriendRequest() {
    return useTanUpdate<IngoingFriendRequest, UpdateFriendRequestVars>({
        mutationFn: async ({ id, body }) => {
            const res = await api.patch(`friend_request/${id}`, body);
            return res.data.data;
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        {
                            tags: [['ingoing_friend_requests']],
                            type: 'update',
                        },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [
                    ['ingoing_friend_requests'],
                    ['friends'],
                    ['search_user'],
                ],
            },
        },
    });
}

// ============================================================
// UNFRIEND — PATCH /friendship/:friend_id
// ============================================================
export function useUnfriend() {
    return useTanUpdate<Friendship, UnfriendVars>({
        mutationFn: async ({ friend_id }) => {
            const res = await api.patch(`friendship/${friend_id}`);
            return res.data.data;
        },
        getId: (vars) => vars.friend_id,
        options: {
            onSuccess: {
                invalidateTags: [['friends'], ['search_user']],
            },
        },
    });
}