'use client';

import { useTranslations } from 'next-intl';

import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';
import SearchGroupCard from '@/components/group_search/SearchGroupCard.compo';
import { useSearchGroupsByName } from '@/hooks/group_search/group_search.hook';
import type { SearchGroup } from '@/types/group_search/group_search.type';

interface Props {
    keyword: string;
}

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

    const groups = data?.pages.flatMap((p) => p) ?? [];

    if (!keyword.trim()) {
        return (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">{txt('no_results')}</p>
            </div>
        );
    }

    if (!isLoading && groups.length === 0) {
        return (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
                <div className="text-center">
                    <p className="text-sm font-medium">{txt('no_groups_found')}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {txt('try_another_keyword')}
                    </p>
                </div>
            </div>
        );
    }

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
        />
    );
}