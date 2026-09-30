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
    CreatePreparationVars,
    QuestionPreparation,
    UpdatePreparationVars,
} from '@/types/question_preparation/question_preparation.type';

const PREPARATION_PAGE_SIZE = 10;

// ============================================================
// Query key — tách rõ list / detail để optimistic UI trỏ ĐÚNG key
// (setQueryData cần key chính xác, không phải prefix)
// ============================================================

export const preparationListKey = (collectionId: string) => [
    'question_preparations',
    collectionId,
];

export const preparationDetailKey = (
    collectionId: string,
    preparationId: string,
) => ['question_preparation', collectionId, preparationId];

// ============================================================
// READ
// ============================================================

export function useGetMyPreparation(input: {
    collectionId: string;
    preparationId: string;
}) {
    const { collectionId, preparationId } = input;

    return useQuery<QuestionPreparation | null>({
        queryKey: preparationDetailKey(collectionId, preparationId),
        queryFn: async () => {
            const res = await api.get(
                `question_preparation/me/${collectionId}/${preparationId}`,
            );
            return res.data.data;
        },
        enabled: !!collectionId && !!preparationId,
    });
}

export function useGetMyPreparations(collectionId: string) {
    return useInfiniteQuery<
        QuestionPreparation[],
        Error,
        InfiniteData<QuestionPreparation[], number>,
        string[],
        number
    >({
        queryKey: preparationListKey(collectionId),
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `question_preparation/me/${collectionId}?page=${pageParam}&limit=${PREPARATION_PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= PREPARATION_PAGE_SIZE
                ? allPages.length + 1
                : undefined,
        enabled: !!collectionId,
        staleTime: 5 * 60 * 1000,
    });
}

// ============================================================
// CREATE
// ============================================================

export function useCreatePreparation(collectionId: string) {
    const listKey = preparationListKey(collectionId);

    return useTanCreate<QuestionPreparation, CreatePreparationVars>({
        mutationFn: async ({ title, content, correct_answer }) => {
            const res = await api.post<{ data: QuestionPreparation }>(
                'question_preparation',
                { title, collection: collectionId, content, correct_answer },
            );
            return res.data.data;
        },
        options: {
            onSuccess: {
                optimisticUI: {
                    page: [{ tags: [listKey], type: 'add' }],
                },
                invalidateTags: [listKey],
            },
        },
    });
}

// ============================================================
// UPDATE
// ============================================================

export function useUpdatePreparation(collectionId: string) {
    const listKey = preparationListKey(collectionId);

    return useTanUpdate<QuestionPreparation, UpdatePreparationVars>({
        mutationFn: async ({ collection_id, preparation_id, body }) => {
            const res = await api.patch<{ data: QuestionPreparation }>(
                `question_preparation/${collection_id}/${preparation_id}`,
                body,
            );
            return res.data.data;
        },
        getId: (vars) => vars.preparation_id,
        options: {
            onMutate: {
                optimisticUI: {
                    page: [{ tags: [listKey], type: 'update' }],
                },
            },
            onSuccess: {
                // invalidateTags dùng PREFIX match nên sẽ làm mới cả detail
                invalidateTags: [
                    listKey,
                    ['question_preparation', collectionId],
                ],
            },
        },
    });
}

// ============================================================
// DELETE
// ============================================================

export function useDeletePreparation(collectionId: string) {
    const listKey = preparationListKey(collectionId);

    return useTanDelete<QuestionPreparation, string>({
        mutationFn: async (id) => {
            await api.delete(`question_preparation/${id}`);
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [{ tags: [listKey], type: 'remove' }],
                },
            },
            onSuccess: {
                invalidateTags: [listKey],
            },
        },
    });
}

// ============================================================
// PICKER — lấy 1 lần, không phân trang (cho modal chọn đề khi giao bài)
// ============================================================

export function useGetMyPreparationsPicker(collectionId: string) {
    return useQuery<QuestionPreparation[]>({
        queryKey: ['question_preparations', 'picker', collectionId],
        queryFn: async () => {
            const res = await api.get(
                `question_preparation/me/${collectionId}?page=1&limit=100`,
            );
            return res.data.data;
        },
        enabled: !!collectionId,
        staleTime: 5 * 60 * 1000,
    });
}
