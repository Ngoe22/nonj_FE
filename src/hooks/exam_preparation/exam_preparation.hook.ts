'use client';

import {InfiniteData, useInfiniteQuery, useQuery} from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';

import type {
    ExamCollection,
    ExamTemplate,
    CreateCollectionVars,
    UpdateCollectionVars,
    CreateTemplateVars,
    UpdateTemplateVars,
    DeleteTemplateVars,
} from '@/types/exam_preparation/exam_preparation.type';
import {useTanCreate, useTanDelete, useTanUpdate} from "@/hooks/_share/tan_crud/tan_crud.hook";


const TEMPLATE_PAGE_SIZE = 10;

// ============================================================
// TEMPLATES (theo collection)
// ============================================================



export function useGetMyTemplate ( input : {  collectionId : string , preparationId  :string }) {
   const { collectionId , preparationId } = input
    return useQuery<ExamTemplate | null>({
        queryKey: ['exam_template', collectionId, preparationId],
        queryFn: async (  ) => {

            const res = await api.get(
                `user_exercise_template/me/${collectionId}/${preparationId}`,
            );
            return  res.data.data
        },
        enabled: !!collectionId && !!preparationId,
    });
}



export function useGetMyTemplates(collectionId: string) {
    return useInfiniteQuery<ExamTemplate[], Error, InfiniteData<ExamTemplate[], number>, string[], number>({
        queryKey: ['exam_templates', collectionId],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `user_exercise_template/me/${collectionId}?page=${pageParam}&limit=${TEMPLATE_PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= TEMPLATE_PAGE_SIZE ? allPages.length + 1 : undefined,
        enabled: !!collectionId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateTemplate(collectionId: string) {
    return useTanCreate<ExamTemplate, CreateTemplateVars>({
        mutationFn: async ({ title, preparation_content  , correct_answer}) => {
            const res = await api.post<{ data: ExamTemplate }>(
                `user_exercise_template`,
                {
                    title,
                    collection: collectionId,
                    preparation_content,
                    correct_answer
                },
            );
            return res.data.data;
        },
        options: {
            onSuccess: {
                optimisticUI: {
                    page: [{ tags: [['exam_templates', collectionId]], type: 'add' }],
                },
                invalidateTags: [['exam_templates', collectionId]],
            },
        },
    });
}

export function useUpdateTemplate() {
    return useTanUpdate<ExamTemplate, UpdateTemplateVars>({
        mutationFn: async ({ collection_id, template_id, body }) => {
            const res = await api.patch<{ data: ExamTemplate }>(
                `user_exercise_template/${collection_id}/${template_id}`,
                body,
            );
            return res.data.data;
        },
        getId: (vars) => vars.template_id,
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        { tags: [['exam_templates']], type: 'update' },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: [['exam_templates']],
            },
        },
    });
}

export function useDeleteTemplate() {
    return useTanDelete<ExamTemplate, string>({
        mutationFn: async (id) => {
            await api.delete(`user_exercise_template/${id}`);
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [{ tags: [['exam_templates']], type: 'remove' }],
                },
            },
            onSuccess: {
                invalidateTags: [['exam_templates']],
            },
        },
    });
}