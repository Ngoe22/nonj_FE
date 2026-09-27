'use client';

import SearchGroupNameResults from '@/components/group_search/Search/SearchResults/ByName/SearchGroupNameResults.compo';
import SearchGroupSlugResult from '@/components/group_search/Search/SearchResults/BySlug/SearchGroupSlugResult.compo';
import type { SearchGroupMode } from '@/types/group_search/group_search.type';

interface Props {
    /** Chỉ 1 param này quyết định hiển thị kết quả theo slug hay theo name */
    mode: SearchGroupMode;
    keyword: string;
}

/**
 * Dispatcher kết quả tìm kiếm nhóm.
 * Mỗi mode là 1 component riêng để dễ debug (chỉ sửa/xem 1 chỗ):
 * - slug → SearchGroupSlugResult (1 object, useQuery)
 * - name → SearchGroupNameResults (array, useInfiniteQuery + infinite scroll)
 */
export default function SearchGroupResult({ mode, keyword }: Props) {
    if (mode === 'slug') {
        return <SearchGroupSlugResult keyword={keyword} />;
    }

    return <SearchGroupNameResults keyword={keyword} />;
}
