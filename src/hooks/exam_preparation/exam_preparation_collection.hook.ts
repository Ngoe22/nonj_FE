import {InfiniteData, useInfiniteQuery} from "@tanstack/react-query";
import type {
    CreateCollectionVars,
    ExamCollection,
    UpdateCollectionVars
} from "@/types/exam_preparation/exam_preparation.type";
import {api} from "@/lib/axios/axios";
import {useTanCreate, useTanDelete, useTanUpdate} from "@/hooks/_share/tan_crud/tan_crud.hook";

const COLLECTION_PAGE_SIZE = 10;

// ============================================================
// COLLECTIONS
// ============================================================
export function useGetMyCollections() {
    return useInfiniteQuery<ExamCollection[], Error, InfiniteData<ExamCollection[], number>, string[], number>({
        queryKey: ['exam_collections'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `exercise_template_collection/me?page=${pageParam}&limit=${COLLECTION_PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= COLLECTION_PAGE_SIZE ? allPages.length + 1 : undefined,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateCollection() {
    return useTanCreate<ExamCollection, CreateCollectionVars>({
        mutationFn: async (body) => {
            const res = await api.post<{ data: ExamCollection }>(
                `exercise_template_collection`,
                body,
            );
            return res.data.data;
        },
        options: {
            onSuccess: {
                optimisticUI: {
                    page: [{ tags: [['exam_collections']], type: 'add' }],
                },
                invalidateTags: [['exam_collections']],
            },
        },
    });
}

export function useUpdateCollection() {
    return useTanUpdate<ExamCollection, UpdateCollectionVars>({
        mutationFn: async ({ id, body }) => {
            const res = await api.patch<{ data: ExamCollection }>(
                `exercise_template_collection/me/${id}`,
                body,
            );
            return res.data.data;
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [{ tags: [['exam_collections']], type: 'update' }],
                },
            },
            onSuccess: {
                invalidateTags: [['exam_collections']],
            },
        },
    });
}

export function useDeleteCollection() {
    return useTanDelete<ExamCollection, string>({
        mutationFn: async (id) => {
            await api.delete(`exercise_template_collection/me/${id}`);
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [{ tags: [['exam_collections']], type: 'remove' }],
                },
            },
            onSuccess: {
                invalidateTags: [['exam_collections']],
            },
        },
    });
}
