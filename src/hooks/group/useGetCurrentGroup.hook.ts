import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios/axios';

export function useGetGroup(groupId: string) {
    return useQuery({
        queryKey: ['group', groupId],

        queryFn: async () => {
            const res = await api.get(
                `group/id_search/${groupId}`
            );

            return res.data.data;
        },

        enabled: !!groupId,

        staleTime: 5 * 60 * 1000,
    });
}