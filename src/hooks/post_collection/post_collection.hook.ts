'use client';

import {InfiniteData, useInfiniteQuery} from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import {
    useTanCreate,
    useTanDelete,
    useTanUpdate,
} from '@/hooks/_share/tan_crud/tan_crud.hook';
import type {
    Collection,
    UpdateCollectionVars,
} from '@/types/post_collection/post_collection.type';
import type { CreateCollectionFormValues } from '@/schemas/post_collection/post_collection.schema';
import type {GroupMember} from "@/types/group/group_member.type";

const PAGE_SIZE = 20;

// ============================================================
// GET MANY — infinite query (BE trả array thuần)
// ============================================================
export function useGetCollections(groupId: string) {
    return useInfiniteQuery<Collection[], Error,  InfiniteData<Collection[], number>, string[], number>({

        queryKey: ['collections', groupId],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `group/${groupId}/collection?page=${pageParam}&limit=${PAGE_SIZE}`,
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
// CREATE
// ============================================================
export function useCreateCollection(groupId: string) {
    return useTanCreate<Collection, CreateCollectionFormValues>({
        mutationFn: async (body) => {
            const res = await api.post<{ data: Collection }>(
                `group/${groupId}/collection`,
                body,
            );
            return res.data.data;
        },
        options: {
            onSuccess: {
                optimisticUI: {
                    page: [
                        { tags: [['collections', groupId]], type: 'add' },
                    ],
                },
                invalidateTags: [['collections', groupId]],
            },
        },
    });
}

// ============================================================
// UPDATE
// ============================================================
export function useUpdateCollection(groupId: string) {
    return useTanUpdate<Collection, UpdateCollectionVars>({
        mutationFn: async ({ id, body }) => {
            const res = await api.patch<{ data: Collection }>(
                `group/${groupId}/collection/${id}`,
                body,
            );
            return res.data.data;
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        { tags: [['collections', groupId]], type: 'update' },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [['collections', groupId]],
            },
        },
    });
}

// ============================================================
// DELETE
// ============================================================
export function useDeleteCollection(groupId: string) {
    return useTanDelete<Collection, string>({
        mutationFn: async (id) => {
            await api.delete(`group/${groupId}/collection/${id}`);
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        { tags: [['collections', groupId]], type: 'remove' },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [['collections', groupId]],
            },
        },
    });
}