import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

import { api } from '@/lib/axios/axios';
import type { CreateGroupFormValues } from '@/schemas/group/group.schema';
import {optimisticUpdate} from "@/helper/tantack/tanstack_InfinityDataOnAction.helper";
import {Group} from "@/types/group/group.type";



export type UpdateGroupVars = {
    id: string;
    body: Partial<CreateGroupFormValues>;
};


const KEYS = [['my_own_group'], ['my_all_group']];


export function useUpdateGroup() {
    const txt = useTranslations('Toast');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, body }: UpdateGroupVars): Promise<Group> => {
            const res = await api.patch<{ data: Group }>(`group/${id}`, body);
            return res.data.data;
        },

        onMutate: async ({ id, body }) => {
            return await optimisticUpdate<Group>(queryClient, KEYS, id, body);
        },

        onError: (_err, _vars, snapshot) => {
            snapshot?.forEach(({ key, old }) => {
                queryClient.setQueryData(key, old);
            });
            toast.error(txt('group_update_fail'));
        },

        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['my_own_group']});
            await queryClient.invalidateQueries({queryKey: ['my_all_group']});
        },
    });
}