'use client';

import { useState } from 'react';

import GroupSearchBar from '@/components/group_search/Search/SearchBar/GroupSearchBar.compo';
import SearchGroupResult from '@/components/group_search/Search/SearchResults/SearchGroupResult.compo';
import type { SearchGroupMode } from '@/types/group_search/group_search.type';

/**
 * Nội dung tab "Search": giữ state mode + keyword.
 * Chỉ truyền `mode` xuống SearchGroupResult để nó tự quyết định
 * hiển thị kết quả slug hay name.
 */
export default function SearchGroupSearchTab() {
    const [mode, setMode] = useState<SearchGroupMode>('slug');
    const [keyword, setKeyword] = useState('');

    return (
        <div className="space-y-5">
            <GroupSearchBar
                mode={mode}
                onModeChange={setMode}
                onSearch={setKeyword}
            />

            <SearchGroupResult mode={mode} keyword={keyword} />
        </div>
    );
}
