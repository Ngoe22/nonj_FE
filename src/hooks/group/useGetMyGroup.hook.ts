import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios/axios';

// ============================================================
// JOINED GROUP — phân trang
// ============================================================
export function useGetJoinedGroup() {
    return useInfiniteQuery({
        queryKey: ['my_all_group'],
        queryFn: async ({ pageParam }) => {
            const res = await api.get(`group/joined?page=${pageParam}`);
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        staleTime: 60 * 60 * 1000,
    });
}

// ============================================================
// OWN GROUP — phân trang
// ============================================================
export function useGetOwnGroup() {
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