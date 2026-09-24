'use client';

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

import { api } from '@/lib/axios/axios';
import {
    optimisticInfinityAction,
    rollbackSnapshot,
} from '@/helper/tantack/tanstack_InfinityDataOnAction.helper';
import {MutationOptions, TanCrudConfig} from "@/types/tan_crud/tan_crud.type";








// ========================================

export function useTanCrud<T extends { id: string }>(config: TanCrudConfig<T>) {
    const queryClient = useQueryClient();
    const txt = useTranslations('Toast');

    const { keysOfPages, keysOfSingle, endpoint, transformItem, pageSize = 20 } = config;

    // ============================================================
    // Helpers
    // ============================================================
    const invalidatePages = () =>
        Promise.all(
            keysOfPages.map((k) =>
                queryClient.invalidateQueries({ queryKey: [k] }),
            ),
        );

    const invalidateOne = (id?: string) =>
        Promise.all(
            keysOfSingle.map((k) =>
                queryClient.invalidateQueries({
                    queryKey: id ? [k, id] : [k],
                }),
            ),
        );

    // ============================================================
    // GET — pages (infinite)
    // ============================================================
    const useGetPages = (extraKeys: string[] = [], enabled = true) =>
        useInfiniteQuery({
            queryKey: [...keysOfPages, ...extraKeys],
            queryFn: async ({ pageParam }) => {
                const res = await api.get(`${endpoint.getMany}?page=${pageParam}`);
                const list = res.data.data as any[];
                return transformItem ? list.map(transformItem) : (list as T[]);
            },
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) =>
                lastPage.length >= pageSize ? allPages.length + 1 : undefined,
            enabled,
            staleTime: 5 * 60 * 1000,
        });

    // ============================================================
    // GET — one
    // ============================================================
    const useGetOne = (id: string, extraKeys: string[] = []) =>
        useQuery({
            queryKey: [...keysOfSingle, id, ...extraKeys],
            queryFn: async () => {
                const res = await api.get(endpoint.getOne.replace(':id', id));
                const raw = res.data.data;
                return transformItem ? transformItem(raw) : (raw as T);
            },
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        });

    // ============================================================
    // CREATE
    // ============================================================
    const useCreate = (options: MutationOptions = {}) =>
        useMutation<T, Error, Record<string, any>, any>({
            mutationFn: async (body) => {
                const res = await api.post(endpoint.createOne, body);
                const raw = res.data.data;
                return transformItem ? transformItem(raw) : raw;
            },

            // Create chỉ dùng onSuccess (theo yêu cầu trước đó)
            onSuccess: async (newItem) => {
                if (options.invalidate?.pages) await invalidatePages();
                if (options.invalidate?.one) await invalidateOne(newItem.id);

                if (options.onSuccessCallback) options.onSuccessCallback();
            },

            onError: () => {
                toast.error(txt('action_fail'));
                if (options.onErrorCallback) options.onErrorCallback();
            },
        });

    // ============================================================
    // UPDATE
    // ============================================================
    const useUpdate = (options: MutationOptions = {}) =>
        useMutation<T, Error, { id: string; body: Record<string, any> }, any>({
            mutationFn: async ({ id, body }) => {
                const res = await api.patch(
                    endpoint.updateOne.replace(':id', id),
                    body,
                );
                const raw = res.data.data;
                return transformItem ? transformItem(raw) : raw;
            },

            onMutate: async ({ id, body }) => {
                const snapshots: any = {};

                if (options.optimistic?.pages) {
                    snapshots.pages = await optimisticInfinityAction<T>(
                        queryClient,
                        keysOfPages.map((k) => [k]),
                        { mode: options.optimistic.pages, id, body: body as Partial<T> },
                    );
                }

                if (options.optimistic?.one) {
                    // Optimistic cho single cache
                    const prev = queryClient.getQueryData<T>([...keysOfSingle, id]);
                    if (prev) {
                        queryClient.setQueryData<T>([...keysOfSingle, id], {
                            ...prev,
                            ...body,
                        });
                    }
                    snapshots.one = { prev, id };
                }

                return snapshots;
            },

            onError: (_err, _vars, ctx) => {
                rollbackSnapshot(queryClient, ctx?.pages);
                if (ctx?.one?.prev !== undefined) {
                    queryClient.setQueryData(
                        [...keysOfSingle, ctx.one.id],
                        ctx.one.prev,
                    );
                }
                toast.error(txt('action_fail'));
                if (options.onErrorCallback) options.onErrorCallback();
            },

            onSuccess: async (updated) => {
                if (options.invalidate?.pages) await invalidatePages();
                if (options.invalidate?.one) await invalidateOne(updated.id);
                if (options.onSuccessCallback) options.onSuccessCallback();
            },
        });

    // ============================================================
    // DELETE
    // ============================================================
    const useDelete = (options: MutationOptions = {}) =>
        useMutation<void, Error, string, any>({
            mutationFn: async (id) => {
                await api.delete(endpoint.deleteOne.replace(':id', id));
            },

            onMutate: async (id) => {
                const snapshots: any = {};

                if (options.optimistic?.pages) {
                    snapshots.pages = await optimisticInfinityAction<T>(
                        queryClient,
                        keysOfPages.map((k) => [k]),
                        { mode: options.optimistic.pages, id },
                    );
                }

                if (options.optimistic?.one) {
                    const prev = queryClient.getQueryData<T>([...keysOfSingle, id]);
                    queryClient.removeQueries({ queryKey: [...keysOfSingle, id] });
                    snapshots.one = { prev, id };
                }

                return snapshots;
            },

            onError: (_err, _id, ctx) => {
                rollbackSnapshot(queryClient, ctx?.pages);
                if (ctx?.one?.prev !== undefined) {
                    queryClient.setQueryData(
                        [...keysOfSingle, ctx.one.id],
                        ctx.one.prev,
                    );
                }
                toast.error(txt('action_fail'));
                if (options.onErrorCallback) options.onErrorCallback();
            },

            onSuccess: async (_data, id) => {
                if (options.invalidate?.pages) await invalidatePages();
                if (options.invalidate?.one) await invalidateOne(id);
                if (options.onSuccessCallback) options.onSuccessCallback();
            },
        });

    // ============================================================
    // Return
    // ============================================================
    return {
        useGetPages,
        useGetOne,
        useCreate,
        useUpdate,
        useDelete,
        // expose helpers nếu cần
        invalidatePages,
        invalidateOne,
        queryClient,
    };
}