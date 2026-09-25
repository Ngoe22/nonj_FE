'use client';

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

import {
    applyOptimisticUI,
    collectKeys,
    invalidateKeys,
    prepareOptimistic,
    removeKeys,
    rollback,
} from './tan_crud.helper';
import type {
    CreateHookOptions,
    DeleteHookOptions,
    GetManyConfig,
    GetOneConfig,
    UpdateHookOptions,
} from '@/types/tan_crud/tan_crud.type';

// ============================================================
// GET MANY
// ============================================================
export function useTanGetMany<T>(config: GetManyConfig<T>) {
    const {
        queryKey,
        queryFn,
        pageSize = 10,
        enabled = true,
        staleTime = 5 * 60 * 1000,
    } = config;

    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => queryFn(pageParam as number),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= pageSize ? allPages.length + 1 : undefined,
        enabled,
        staleTime,
    });
}

// ============================================================
// GET ONE
// ============================================================
export function useTanGetOne<T>(config: GetOneConfig<T>) {
    const { queryKey, queryFn, enabled = true, staleTime = 5 * 60 * 1000 } = config;

    return useQuery({
        queryKey,
        queryFn,
        enabled,
        staleTime,
    });
}

// ============================================================
// UPDATE
// ============================================================
export function useTanUpdate<T extends { id: string }>(config: {
    mutationFn: (vars: { id: string; body: Partial<T> }) => Promise<T>;
    options?: UpdateHookOptions<T>;
}) {

    const queryClient = useQueryClient();
    const { options = {} } = config;

    return useMutation<T, Error, { id: string; body: Partial<T> }, any>({
        mutationFn: config.mutationFn,

        onMutate: async (vars) => {
            // 1. Collect keys từ onMutate.optimisticUI
            const keys = collectKeys(options.onMutate?.optimisticUI);

            // 2. Cancel + snapshot
            const snapshots = keys.length
                ? await prepareOptimistic(queryClient, keys)
                : [];

            // 3. Apply optimistic UI (dùng data từ variables)
            if (options.onMutate?.optimisticUI) {
                applyOptimisticUI<T>(queryClient, options.onMutate.optimisticUI, {
                    id: vars.id,
                    body: vars.body,
                    oneMode: 'update',
                });
            }

            options.onMutate?.onMutateCallback?.(vars);
            return { snapshots };
        },

        onError: (err, _vars, ctx) => {
            if (ctx?.snapshots) rollback(queryClient, ctx.snapshots);
            options.onError?.onErrorCallback?.(err);
        },

        onSuccess: async (data) => {
            // 1. Apply onSuccess.optimisticUI (dùng data thật từ BE)
            if (options.onSuccess?.optimisticUI) {
                applyOptimisticUI<T>(queryClient, options.onSuccess.optimisticUI, {
                    id: data.id,
                    body: data,
                    item: data,
                    oneMode: 'update',
                });
            }

            // 2. Invalidate
            if (options.onSuccess?.invalidateTags?.length) {
                await invalidateKeys(queryClient, options.onSuccess.invalidateTags);
            }

            options.onSuccess?.onSuccessCallback?.(data);
        },
    });
}

// ============================================================
// DELETE
// ============================================================
export function useTanDelete<T extends { id: string }>(config: {
    mutationFn: (id: string) => Promise<void>;
    options?: DeleteHookOptions<T>;
}) {
    const queryClient = useQueryClient();
    const txt = useTranslations('Toast');
    const { options = {} } = config;

    return useMutation<void, Error, string, any>({
        mutationFn: config.mutationFn,

        onMutate: async (id) => {
            const keys = collectKeys(options.onMutate?.optimisticUI);

            const snapshots = keys.length
                ? await prepareOptimistic(queryClient, keys)
                : [];

            if (options.onMutate?.optimisticUI) {
                applyOptimisticUI<T>(queryClient, options.onMutate.optimisticUI, {
                    id,
                    oneMode: 'remove',
                });
            }

            options.onMutate?.onMutateCallback?.(id);
            return { snapshots };
        },

        onError: (err, _id, ctx) => {
            if (ctx?.snapshots) rollback(queryClient, ctx.snapshots);
            options.onError?.onErrorCallback?.(err);
        },

        onSuccess: async (_data, id) => {
            if (options.onSuccess?.optimisticUI) {
                applyOptimisticUI<T>(queryClient, options.onSuccess.optimisticUI, {
                    id,
                    oneMode: 'remove',
                });
            }

            if (options.onSuccess?.invalidateTags?.length) {
                await invalidateKeys(queryClient, options.onSuccess.invalidateTags);
            }

            if (options.onSuccess?.deleteTags?.length) {
                await removeKeys(queryClient, options.onSuccess.deleteTags);
            }

            options.onSuccess?.onSuccessCallback?.(id);
        },
    });
}

// ============================================================
// CREATE
// ============================================================
export function useTanCreate<T extends { id: string }, Body = any>(config: {
    mutationFn: (body: Body) => Promise<T>;
    options?: CreateHookOptions<T>;
}) {
    const queryClient = useQueryClient();
    const txt = useTranslations('Toast');
    const { options = {} } = config;

    return useMutation<T, Error, Body, any>({
        mutationFn: config.mutationFn,

        onMutate: (body) => {
            // Không optimisticUI — chưa có data/id
            options.onMutate?.onMutateCallback?.(body);
        },

        onError: async (err, _body) => {
            if (options.onError?.invalidateTags?.length) {
                await invalidateKeys(queryClient, options.onError.invalidateTags);
            }
            options.onError?.onErrorCallback?.(err);
        },

        onSuccess: async (data) => {
            if (options.onSuccess?.optimisticUI) {
                applyOptimisticUI<T>(queryClient, options.onSuccess.optimisticUI, {
                    id: data.id,
                    body: data,
                    item: data,
                    oneMode: 'add',
                });
            }

            if (options.onSuccess?.invalidateTags?.length) {
                await invalidateKeys(queryClient, options.onSuccess.invalidateTags);
            }

            options.onSuccess?.onSuccessCallback?.(data);
        },
    });
}