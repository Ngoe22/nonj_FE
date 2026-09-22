import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

import { api } from '@/lib/axios/axios';
import {optimisticDelete} from "@/helper/tantack/tanstack_InfinityDataOnAction.helper";
import {Group} from "@/types/group/group.type";

const KEYS = [['my_own_group'], ['my_all_group']];

export function useDeleteGroup() {
    const txt = useTranslations('Toast');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await api.delete(`group/${id}`);
        },

        onMutate: async (id) => {
            return await optimisticDelete<Group>(queryClient, KEYS, id);
        },

        onError: (_err, _id, snapshot) => {
            snapshot?.forEach(({ key, old }) => {
                queryClient.setQueryData(key, old);
            });
            toast.error(txt('group_delete_fail'));
        },

        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['my_own_group']});
            await queryClient.invalidateQueries({queryKey: ['my_all_group']});
        },
    });
}