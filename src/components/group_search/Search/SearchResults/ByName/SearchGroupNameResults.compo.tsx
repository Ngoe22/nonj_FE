'use client';

import { useTranslations } from 'next-intl';

import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';
import SearchGroupCard from '@/components/group_search/Search/GroupCard.compo';
import SearchGroupEmpty from '@/components/group_search/Search/SearchResults/SearchGroupEmpty.compo';
import { useSearchGroupsByName } from '@/hooks/group_search/search_group_name.hook';
import type { SearchGroup } from '@/types/group_search/group_search.type';

interface Props {
    keyword: string;
}

/**
 * NAME SEARCH — BE trả về array nên phải đi qua infinite scroll:
 * mỗi lần scroll tới sentinel sẽ fetch thêm 1 page (NAME_SEARCH_PAGE_SIZE).
 * Loading / error / rỗng đều do InfiniteScrollList xử lý.
 */
export default function SearchGroupNameResults({ keyword }: Props) {
    const txt = useTranslations('Group_search');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useSearchGroupsByName(keyword);

    const groups = data?.pages.flatMap((page) => page) ?? [];

    return (
        <InfiniteScrollList<SearchGroup>
            items={groups}
            getKey={(g) => g.id}
            renderItem={(group) => <SearchGroupCard group={group} />}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
            isError={isError}
            className="space-y-3"
            emptyComponent={
                keyword.trim() ? (
                    <SearchGroupEmpty
                        title={txt('no_groups_found')}
                        description={txt('try_another_keyword')}
                    />
                ) : (
                    <SearchGroupEmpty title={txt('no_results')} />
                )
            }
        />
    );
}
