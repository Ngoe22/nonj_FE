import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

import { api } from '@/lib/axios/axios';
import type { CreateGroupFormValues } from '@/schemas/group/group.schema';
import {optimisticCreate} from "@/helper/tantack/tanstack_InfinityDataOnAction.helper";
import {Group} from "@/types/group/group.type";



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
            return await optimisticCreate<Group>(queryClient, KEYS, body);
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