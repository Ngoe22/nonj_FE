'use client';

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult, UseQueryResult, UseInfiniteQueryResult, InfiniteData,
} from '@tanstack/react-query';

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
// UPDATE — generic TVars
// ============================================================
export function useTanUpdate<T = any, TVars = any>(config: {
    mutationFn: (vars: TVars) => Promise<T>;
    /** Extract id từ vars — dùng cho optimistic. Default: `(vars as any).id` */
    getId?: (vars: TVars) => string;
    options?: UpdateHookOptions<T>;
    /** Cho phép override thêm useMutation options */
    [key: string]: any;
}): UseMutationResult<T, Error, TVars, any> {
    const queryClient = useQueryClient();
    const { mutationFn, getId, options = {}, ...rest } = config;

    return useMutation<T, Error, TVars, any>({
        ...(rest as any),
        mutationFn,

        onMutate: async (vars) => {
            const id =
                getId?.(vars) ??
                (typeof vars === 'object' && vars !== null
                    ? (vars as any).id
                    : undefined);

            const body =
                typeof vars === 'object' && vars !== null && 'body' in (vars as any)
                    ? (vars as any).body
                    : vars;

            const keys = collectKeys(options.onMutate?.optimisticUI);
            const snapshots = keys.length
                ? await prepareOptimistic(queryClient, keys)
                : [];

            if (options.onMutate?.optimisticUI) {
                applyOptimisticUI<T>(queryClient, options.onMutate.optimisticUI, {
                    id,
                    body,
                    oneMode: 'update',
                });
            }

            options.onMutate?.onMutateCallback?.(vars);
            return { snapshots };
        },

        onError: (err, _vars, ctx) => {
            if ((ctx as any)?.snapshots) {
                rollback(queryClient, (ctx as any).snapshots);
            }
            options.onError?.onErrorCallback?.(err);
        },

        onSuccess: async (data) => {
            const id = (data as any)?.id;

            if (options.onSuccess?.optimisticUI) {
                applyOptimisticUI<T>(queryClient, options.onSuccess.optimisticUI, {
                    id,
                    body: data,
                    item: data,
                    oneMode: 'update',
                });
            }

            if (options.onSuccess?.invalidateTags?.length) {
                await invalidateKeys(queryClient, options.onSuccess.invalidateTags);
            }

            if (options.onSuccess?.deleteTags?.length) {
                await removeKeys(queryClient, options.onSuccess.deleteTags);
            }

            options.onSuccess?.onSuccessCallback?.(data);
        },
    });
}

// ============================================================
// DELETE — generic TVars
// ============================================================
export function useTanDelete<T = any, TVars = any>(config: {
    mutationFn: (vars: TVars) => Promise<any>;
    /** Extract id từ vars — dùng cho optimistic. Default: string hoặc `(vars as any).id` */
    getId?: (vars: TVars) => string;
    options?: DeleteHookOptions<T>;
    [key: string]: any;
}): UseMutationResult<any, Error, TVars, any> {
    const queryClient = useQueryClient();
    const { mutationFn, getId, options = {}, ...rest } = config;

    return useMutation<any, Error, TVars, any>({
        ...(rest as any),
        mutationFn,

        onMutate: async (vars) => {
            const id =
                getId?.(vars) ??
                (typeof vars === 'string'
                    ? vars
                    : typeof vars === 'object' && vars !== null
                        ? (vars as any).id
                        : undefined);

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

            options.onMutate?.onMutateCallback?.(vars);
            return { snapshots };
        },

        onError: (err, _vars, ctx) => {
            if ((ctx as any)?.snapshots) {
                rollback(queryClient, (ctx as any).snapshots);
            }
            options.onError?.onErrorCallback?.(err);
        },

        onSuccess: async (data, vars) => {
            const id =
                getId?.(vars) ??
                (typeof vars === 'string'
                    ? vars
                    : typeof vars === 'object' && vars !== null
                        ? (vars as any).id
                        : undefined);

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

            options.onSuccess?.onSuccessCallback?.(data);
        },
    });
}

// ============================================================
// CREATE — generic TVars
// ============================================================
export function useTanCreate<T = any, TVars = any>(config: {
    mutationFn: (vars: TVars) => Promise<T>;
    options?: CreateHookOptions<T>;
    [key: string]: any;
}): UseMutationResult<T, Error, TVars, any> {
    const queryClient = useQueryClient();
    const { mutationFn, options = {}, ...rest } = config;

    return useMutation<T, Error, TVars, any>({
        ...(rest as any),
        mutationFn,

        onMutate: (vars) => {
            options.onMutate?.onMutateCallback?.(vars);
        },

        onError: async (err, _vars) => {
            if (options.onError?.invalidateTags?.length) {
                await invalidateKeys(queryClient, options.onError.invalidateTags);
            }
            options.onError?.onErrorCallback?.(err);
        },

        onSuccess: async (data) => {
            const id = (data as any)?.id;

            if (options.onSuccess?.optimisticUI) {
                applyOptimisticUI<T>(queryClient, options.onSuccess.optimisticUI, {
                    id,
                    body: data,
                    item: data,
                    oneMode: 'add',
                });
            }

            if (options.onSuccess?.invalidateTags?.length) {
                await invalidateKeys(queryClient, options.onSuccess.invalidateTags);
            }

            if (options.onSuccess?.deleteTags?.length) {
                await removeKeys(queryClient, options.onSuccess.deleteTags);
            }

            options.onSuccess?.onSuccessCallback?.(data);
        },
    });
}