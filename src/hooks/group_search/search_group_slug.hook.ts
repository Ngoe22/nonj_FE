'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import { searchGroupSlugKey } from '@/hooks/group_search/group_search.const';
import type { SearchGroup } from '@/types/group_search/group_search.type';

// ============================================================
// SLUG SEARCH —
// ============================================================
export function useSearchGroupBySlug(slug: string) {
    const trimmed = slug.trim();

    return useQuery<SearchGroup | null>({
        queryKey: searchGroupSlugKey(trimmed),
        queryFn: async () => {
            try {
                const res = await api.get(
                    `group/slug_search/${encodeURIComponent(trimmed)}`,
                );
                return res.data.data ?? null;
            } catch (error) {
                // 404 = không tìm thấy nhóm nào => coi như "không có kết quả"
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },
        enabled: !!trimmed,
        staleTime: 2 * 60 * 1000,
        retry: false,
    });
}
