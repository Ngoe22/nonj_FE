import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios/axios';
import type { CreateGroupFormValues } from '@/schemas/group/group.schema';
import {Group} from "@/types/group/group.type";
import {optimisticInfinityCreate} from "@/helper/tantack/tanstack_InfinityDataOnAction.helper";


// ===================================================================


const KEYS = [['my_own_group'], ['my_all_group']];

export function useCreateGroup() {
    const txt = useTranslations('Toast');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: CreateGroupFormValues): Promise<Group> => {
            const res = await api.post<{ data: Group }>('group', body);
            return res.data.data;
        },

        onSuccess: async (body) => {
            return await optimisticInfinityCreate<Group>(queryClient, KEYS, body);
        },

        onError: (_err, _body, snapshot ) => {
            toast.error(txt('action_fail'));
        },

        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['my_own_group']});
            await queryClient.invalidateQueries({queryKey: ['my_all_group']});
        },
    });
}


// ===================================


// ============================================================
// JOINED GROUPS — phân trang
// ============================================================
export function useGetJoinedGroups() {
    return useInfiniteQuery({
        queryKey: ['my_all_group'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(`group/joined?page=${pageParam}`);
            console.log(res.data.data);
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        staleTime: 60 * 60 * 1000,
    });
}

// ============================================================
// OWN GROUPS — phân trang
// ============================================================
export function useGetOwnGroups() {
    return useInfiniteQuery({
        queryKey: ['my_own_group'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(`group/own?page=${pageParam}`);
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        staleTime: 60 * 60 * 1000,
    });
}