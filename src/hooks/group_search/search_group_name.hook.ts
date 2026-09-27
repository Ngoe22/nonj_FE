'use client';

import axios from 'axios';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import {
    NAME_SEARCH_PAGE_SIZE,
    searchGroupNameKey,
} from '@/hooks/group_search/group_search.const';
import type { SearchGroup } from '@/types/group_search/group_search.type';

// ============================================================
// NAME SEARCH — BE trả về ARRAY cho mỗi page
// => useInfiniteQuery + InfiniteScrollList để load dần từng page
// (data.pages = mảng các mảng, component tự flatMap)
// ============================================================
export function useSearchGroupsByName(name: string) {
    const trimmed = name.trim();

    return useInfiniteQuery<SearchGroup[], Error, InfiniteData<SearchGroup[], number>, string[], number>({
        queryKey: searchGroupNameKey(trimmed),
        queryFn: async ({ pageParam }) => {
            try {
                const res = await api.get(
                    `group/name_search/${encodeURIComponent(trimmed)}?page=${pageParam}&limit=${NAME_SEARCH_PAGE_SIZE}`,
                );
                return res.data.data;
            } catch (error) {
                // 404 = không có nhóm nào khớp → trả mảng rỗng.
                // KHÔNG được trả `null`: null sẽ lọt vào list và crash lúc render
                // vì `pages.flatMap(p => p)` biến nó thành 1 item null.
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    return [];
                }
                throw error;
            }
        },
        initialPageParam: 1,
        // Còn đủ 1 page => còn trang tiếp theo
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= NAME_SEARCH_PAGE_SIZE
                ? allPages.length + 1
                : undefined,
        enabled: !!trimmed,
        staleTime: 2 * 60 * 1000,
        retry: false,
    });
}
