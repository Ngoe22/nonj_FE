'use client';

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type UseInfiniteQueryResult,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

import { api } from '@/lib/axios/axios';
import {DynamicValues, EndpointDef, MutationOptions, QueryOptions, TanCrudConfig} from "@/types/tan_crud/tan_crud.type";
import {buildEndpoint, optimisticInfinityAction, rollbackSnapshot} from "@/hooks/tan_crud/tan_crud.helper";


// ============================================================
// Factory return type — method name = endpoint key
// ============================================================
type CrudMethods<T extends { id: string }, E extends Record<string, EndpointDef>> = {
    [K in keyof E]: E[K]['type'] extends 'getMany'
        ? (options?: QueryOptions) => UseInfiniteQueryResult<any>
        : E[K]['type'] extends 'getOne'
            ? (options?: QueryOptions) => UseQueryResult<T>
            : E[K]['type'] extends 'createOne'
                ? (options?: MutationOptions) => UseMutationResult<T, Error, Record<string, any>, any>
                : E[K]['type'] extends 'updateOne'
                    ? (options?: MutationOptions) => UseMutationResult<T, Error, { id: string; body: Record<string, any> }, any>
                    : E[K]['type'] extends 'deleteOne'
                        ? (options?: MutationOptions) => UseMutationResult<void, Error, string, any>
                        : never;
};


//=====================================================================================




export function useTanCrud<
    T extends { id: string },
    E extends Record<string, EndpointDef>,
>(config: TanCrudConfig<T> & { endpoints: E }) {


    const staleTime = config.staleTime ?? 5 * 6 *1000

    const queryClient = useQueryClient();
    const txt = useTranslations('Toast');

    const { endpoints, pageSize = 20, transformItem, extraBody } = config;

    // ============================================================
    // Helpers
    // ============================================================
    const resolveUrl = (
        def: EndpointDef,
        dynamicValues: DynamicValues = {},
    ) => buildEndpoint(def.endpoint, dynamicValues);

    const invalidateByTags = (tags: string[]) =>
        Promise.all(
            tags.map((t) => queryClient.invalidateQueries({ queryKey: [t] })),
        );

    const invalidateByKeys = (keys: string[][]) =>
        Promise.all(
            keys.map((k) => queryClient.invalidateQueries({ queryKey: k })),
        );

    const removeByTags = (tags: string[]) =>
        Promise.all(
            tags.map((t) => queryClient.removeQueries({ queryKey: [t] })),
        );

    const runSuccessSideEffects = async (options: MutationOptions, data: any) => {
        if (options.invalidateTags?.length) await invalidateByTags(options.invalidateTags);
        if (options.invalidateExtraKeys?.length) await invalidateByKeys(options.invalidateExtraKeys);
        if (options.removeTags?.length) await removeByTags(options.removeTags);
        options.onSuccessCallback?.(data);
    };

    // ============================================================
    // Endpoint → method builders
    // ============================================================
    const buildGetMany = (def: EndpointDef) => (options: QueryOptions = {}) => {
        const { dynamicValues, extraKeys = [], enabled = true } = options;
        return useInfiniteQuery({
            queryKey: [def.tag, ...(def.keySuffix ?? []), ...extraKeys],
            queryFn: async ({ pageParam }) => {
                const url = resolveUrl(def, dynamicValues);
                const res = await api.get(`${url}?page=${pageParam}`);
                const list = res.data.data as any[];
                return transformItem ? list.map(transformItem) : (list as T[]);
            },
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) =>
                lastPage.length >= pageSize ? allPages.length + 1 : undefined,
            enabled,
            staleTime
        });
    };

    const buildGetOne = (def: EndpointDef) => (options: QueryOptions = {}) => {
        const { dynamicValues, extraKeys = [], enabled = true } = options;
        return useQuery({
            queryKey: [def.tag, ...(def.keySuffix ?? []), ...extraKeys],
            queryFn: async () => {
                const url = resolveUrl(def, dynamicValues);
                const res = await api.get(url);
                const raw = res.data.data;
                return transformItem ? transformItem(raw) : (raw as T);
            },
            enabled,
            staleTime
        });
    };

    const buildCreateOne = (def: EndpointDef) => (options: MutationOptions = {}) =>
        useMutation<T, Error, Record<string, any>, any>({
            mutationFn: async (body) => {
                const url = resolveUrl(def, options.dynamicValues);
                const res = await api.post(url, { ...extraBody, ...body });
                const raw = res.data.data;
                return transformItem ? transformItem(raw) : raw;
            },
            onSuccess: (newItem) => runSuccessSideEffects(options, newItem),
            onError: (err) => {
                toast.error(txt('action_fail'));
                options.onErrorCallback?.(err);
            },
        });

    const buildUpdateOne = (def: EndpointDef) => (options: MutationOptions = {}) =>
        useMutation<
            T,
            Error,
            { id: string; body: Record<string, any> },
            any
        >({
            mutationFn: async ({ id, body }) => {
                const url = resolveUrl(def, { ...options.dynamicValues, id });
                const res = await api.patch(url, { ...extraBody, ...body });
                const raw = res.data.data;
                return transformItem ? transformItem(raw) : raw;
            },

            onMutate: async ({ id, body }) => {
                const ctx: any = {};

                if (options.optimistic?.pagesTag && options.optimistic.pagesMode) {
                    ctx.pages = await optimisticInfinityAction<T>(
                        queryClient,
                        [[options.optimistic.pagesTag]],
                        { mode: options.optimistic.pagesMode, id, body: body as Partial<T> },
                    );
                }

                if (options.optimistic?.oneTag && options.optimistic.oneMode) {
                    const key = [options.optimistic.oneTag];
                    const prev = queryClient.getQueryData<T>(key);
                    if (prev && options.optimistic.oneMode === 'update') {
                        queryClient.setQueryData<T>(key, { ...prev, ...body });
                    } else if (options.optimistic.oneMode === 'remove') {
                        queryClient.removeQueries({ queryKey: key });
                    }
                    ctx.one = { key, prev };
                }

                return ctx;
            },

            onError: (err, _vars, ctx) => {
                rollbackSnapshot(queryClient, ctx?.pages);
                if (ctx?.one?.prev !== undefined) {
                    queryClient.setQueryData(ctx.one.key, ctx.one.prev);
                }
                toast.error(txt('action_fail'));
                options.onErrorCallback?.(err);
            },

            onSuccess: (updated) => runSuccessSideEffects(options, updated),
        });

    const buildDeleteOne =
        (def: EndpointDef) =>
        (options: MutationOptions = {}) =>


        useMutation<void, Error, string, any>({
            mutationFn: async (id) => {
                const url = resolveUrl(def, { ...options.dynamicValues, id });
                await api.delete(url);
            },

            onMutate: async (id) => {
                const ctx: any = {};

                if (options.optimistic?.pagesTag && options.optimistic.pagesMode) {
                    ctx.pages = await optimisticInfinityAction<T>(
                        queryClient,
                        [[options.optimistic.pagesTag]],
                        { mode: options.optimistic.pagesMode, id },
                    );
                }

                if (options.optimistic?.oneTag && options.optimistic.oneMode) {
                    const key = [options.optimistic.oneTag];
                    const prev = queryClient.getQueryData<T>(key);
                    if (options.optimistic.oneMode === 'remove') {
                        queryClient.removeQueries({ queryKey: key });
                    }
                    ctx.one = { key, prev };
                }

                return ctx;
            },

            onError: (err, _id, ctx) => {
                rollbackSnapshot(queryClient, ctx?.pages);
                if (ctx?.one?.prev !== undefined) {
                    queryClient.setQueryData(ctx.one.key, ctx.one.prev);
                }
                toast.error(txt('action_fail'));
                options.onErrorCallback?.(err);
            },

            onSuccess: (_data, id) => runSuccessSideEffects(options, id),
        });

    // ============================================================
    // Loop endpoints → build methods theo tên key
    // ============================================================
    const methods: Record<string, any> = {};

    for (const [name, def] of Object.entries(endpoints)) {
        switch (def.type) {
            case 'getMany':
                methods[name] = buildGetMany(def);
                break;
            case 'getOne':
                methods[name] = buildGetOne(def);
                break;
            case 'createOne':
                methods[name] = buildCreateOne(def);
                break;
            case 'updateOne':
                methods[name] = buildUpdateOne(def);
                break;
            case 'deleteOne':
                methods[name] = buildDeleteOne(def);
                break;
        }
    }

    return {
        ...methods,
        queryClient,
        invalidateByTags,
        removeByTags,
    } as CrudMethods<T, E> & {
        queryClient: ReturnType<typeof useQueryClient>;
        invalidateByTags: (tags: string[]) => Promise<any>;
        removeByTags: (tags: string[]) => Promise<any>;
    };
}








/**

    const crud = useTanCrud<Collection, typeof endpoints>({
        endpoints: {
            getCollections: {
            tag: 'collections',
            type: 'getMany',
            endpoint: 'group/:groupId/collection',
        },
        getCollection: {
            tag: 'collection',
            type: 'getOne',
            endpoint: 'group/:groupId/collection/:id',
        },
        createCollection: {
            tag: 'collection',
            type: 'createOne',
            endpoint: 'group/:groupId/collection',
        },
        updateCollection: {
            tag: 'collection',
            type: 'updateOne',
            endpoint: 'group/:groupId/collection/:id',
        },
        deleteCollection: {
            tag: 'collection',
            type: 'deleteOne',
            endpoint: 'group/:groupId/collection/:id',
        },
        // ⬇️ Endpoint thứ 6, cùng type `deleteOne`
        quitCollection: {
            tag: 'collection',
            type: 'deleteOne',
            endpoint: 'group/:groupId/collection/:id/quit',
        },
        },
        pageSize: 20,
    });

    // ============ GET MANY ============
    const list = crud.getCollections({ dynamicValues: { groupId } });

    // ============ GET ONE ============
    const one = crud.getCollection({
        dynamicValues: { groupId, id: collectionId },
    });

    // ============ CREATE ============
    const createMutation = crud.createCollection({
        dynamicValues: { groupId },
        invalidateTags: ['collections'],
    });
    createMutation.mutate({ title: 'X', desc: 'Y' });

    // ============ UPDATE ============
    const updateMutation = crud.updateCollection({
        dynamicValues: { groupId },
        optimistic: {
        pagesTag: 'collections',
        pagesMode: 'update',
        oneTag: 'collection',
        oneMode: 'update',
        },
        invalidateTags: ['collections'],
    });
    updateMutation.mutate({ id, body: { title: 'New' } });

    // ============ DELETE ============
    const deleteMutation = crud.deleteCollection({
        dynamicValues: { groupId },
        optimistic: { pagesTag: 'collections', pagesMode: 'remove' },
        invalidateTags: ['collections'],
    });
    deleteMutation.mutate(id);

    // ============ QUIT (cùng type deleteOne) ============
    const quitMutation = crud.quitCollection({
        dynamicValues: { groupId },
        optimistic: { pagesTag: 'collections', pagesMode: 'remove' },
        invalidateTags: ['collections', 'my_own_group'],
        removeTags: ['collection'],  // ✅ xoá cache luôn
    });
    quitMutation.mutate(id);


 * */



