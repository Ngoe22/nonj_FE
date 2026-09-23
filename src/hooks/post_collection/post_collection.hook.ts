import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
    type InfiniteData,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

import { api } from '@/lib/axios/axios';
import {Collection, UpdateCollectionVars} from "@/types/post_collection/post_collection.schema";
import {
    optimisticInfinityDelete,
    optimisticInfinityUpdate,
    Snapshot
} from "@/helper/tantack/tanstack_InfinityDataOnAction.helper";


const LIST_KEYS = (groupId: string) => [['collections', groupId]];

// ============================================================
// GET
// ============================================================
export function useGetCollections(groupId: string) {
    return useInfiniteQuery({
        queryKey: ['collections', groupId],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `group/${groupId}/collection?page=${pageParam}`,
            );
            return res.data.data as Collection[];
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length > 0 ? allPages.length + 1 : undefined,
        enabled: !!groupId,
        staleTime: 5 * 60 * 1000,
    });
}

// ============================================================
// CREATE — chỉ onSuccess, prepend item thật vào cache
// ============================================================
export function useCreateCollection(groupId: string) {
    const txt = useTranslations('Toast');
    const queryClient = useQueryClient();

    return useMutation<Collection, Error, { title: string; desc?: string }>({
        mutationFn: async (body) => {
            const res = await api.post<{ data: Collection }>(
                `group/${groupId}/collection`,
                body,
            );
            return res.data.data;
        },

        onSuccess: (newItem) => {
            // ✅ Prepend item thật (có id từ BE) vào page đầu
            queryClient.setQueryData<InfiniteData<Collection[]>>(
                ['collections', groupId],
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages:
                            old.pages.length > 0
                                ? [[newItem, ...old.pages[0]], ...old.pages.slice(1)]
                                : [[newItem]],
                    };
                },
            );
        },

        onError: () => {
            toast.error(txt('action_fail'));
        },

        // ⚠️ Không cần onSettled invalidate nữa — đã setQueryData ở onSuccess
    });
}

// ============================================================
// UPDATE — giữ onMutate (optimistic)
// ============================================================
export function useUpdateCollection(groupId: string) {
    const txt = useTranslations('Toast');
    const queryClient = useQueryClient();
    const keys = LIST_KEYS(groupId);

    return useMutation<
        Collection,
        Error,
        UpdateCollectionVars,
        Snapshot<Collection>
    >({
        mutationFn: async ({ id, body }) => {
            const res = await api.patch<{ data: Collection }>(
                `group/${groupId}/collection/${id}`,
                body,
            );
            return res.data.data;
        },

        onMutate: async ({ id, body }) => {
            return optimisticInfinityUpdate<Collection>(
                queryClient,
                keys,
                id,
                body,
            );
        },

        onError: (_err, _vars, snapshot) => {
            snapshot?.forEach(({ key, old }) => {
                queryClient.setQueryData(key, old);
            });
            toast.error(txt('action_fail'));
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['collections', groupId] });
        },
    });
}

// ============================================================
// DELETE — giữ onMutate (optimistic)
// ============================================================
export function useDeleteCollection(groupId: string) {
    const txt = useTranslations('Toast');
    const queryClient = useQueryClient();
    const keys = LIST_KEYS(groupId);

    return useMutation<void, Error, string, Snapshot<Collection>>({
        mutationFn: async (id) => {
            await api.delete(`group/${groupId}/collection/${id}`);
        },

        onMutate: async (id) => {
            return optimisticInfinityDelete<Collection>(queryClient, keys, id);
        },

        onError: (_err, _id, snapshot) => {
            snapshot?.forEach(({ key, old }) => {
                queryClient.setQueryData(key, old);
            });
            toast.error(txt('action_fail'));
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['collections', groupId] });
        },
    });
}