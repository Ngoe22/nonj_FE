'use client';

import {
    useInfiniteQuery,
    useQuery,
    type InfiniteData,
} from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import {
    useTanCreate,
    useTanDelete,
    useTanUpdate,
} from '@/hooks/_share/tan_crud/tan_crud.hook';
import type {
    CreateCollectionVars,
    QuestionPreparationCollection,
    UpdateCollectionVars,
} from '@/types/question_preparation/question_preparation.type';

const COLLECTION_PAGE_SIZE = 10;

/** Query key CHÍNH XÁC của danh sách thư mục (dùng cho optimistic UI) */
export const preparationCollectionsKey = ['question_preparation_collections'];

// ============================================================
// COLLECTIONS — thư mục đề cá nhân
// ============================================================

export function useGetMyCollections() {
    return useInfiniteQuery<
        QuestionPreparationCollection[],
        Error,
        InfiniteData<QuestionPreparationCollection[], number>,
        string[],
        number
    >({
        queryKey: preparationCollectionsKey,
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `question_preparation_collection/me?page=${pageParam}&limit=${COLLECTION_PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= COLLECTION_PAGE_SIZE
                ? allPages.length + 1
                : undefined,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateCollection() {
    return useTanCreate<QuestionPreparationCollection, CreateCollectionVars>({
        mutationFn: async (body) => {
            const res = await api.post<{
                data: QuestionPreparationCollection;
            }>('question_preparation_collection', body);
            return res.data.data;
        },
        options: {
            onSuccess: {
                optimisticUI: {
                    page: [
                        { tags: [preparationCollectionsKey], type: 'add' },
                    ],
                },
                invalidateTags: [preparationCollectionsKey],
            },
        },
    });
}

export function useUpdateCollection() {
    return useTanUpdate<QuestionPreparationCollection, UpdateCollectionVars>({
        mutationFn: async ({ id, body }) => {
            const res = await api.patch<{
                data: QuestionPreparationCollection;
            }>(`question_preparation_collection/me/${id}`, body);
            return res.data.data;
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        { tags: [preparationCollectionsKey], type: 'update' },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [preparationCollectionsKey],
            },
        },
    });
}

export function useDeleteCollection() {
    return useTanDelete<QuestionPreparationCollection, string>({
        mutationFn: async (id) => {
            await api.delete(`question_preparation_collection/me/${id}`);
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        { tags: [preparationCollectionsKey], type: 'remove' },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [preparationCollectionsKey],
            },
        },
    });
}

// ============================================================
// PICKER — lấy 1 lần, không phân trang (cho modal chọn đề khi giao bài)
// BE giới hạn limit tối đa 100.
// ============================================================

export function useGetMyCollectionsPicker() {
    return useQuery<QuestionPreparationCollection[]>({
        queryKey: ['question_preparation_collections', 'picker'],
        queryFn: async () => {
            const res = await api.get(
                'question_preparation_collection/me?page=1&limit=100',
            );
            return res.data.data;
        },
        staleTime: 5 * 60 * 1000,
    });
}
