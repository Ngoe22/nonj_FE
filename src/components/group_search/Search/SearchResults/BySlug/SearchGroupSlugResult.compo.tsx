'use client';

import { useTranslations } from 'next-intl';

import SearchGroupCard from '@/components/group_search/Search/GroupCard.compo';
import SearchGroupEmpty from '@/components/group_search/Search/SearchResults/SearchGroupEmpty.compo';
import { useSearchGroupBySlug } from '@/hooks/group_search/search_group_slug.hook';

interface Props {
    keyword: string;
}

/**
 * SLUG SEARCH — BE trả về 1 object duy nhất nên KHÔNG dùng infinite,
 * chỉ cần useQuery + 3 trạng thái: chưa nhập / đang load / không thấy.
 */
export default function SearchGroupSlugResult({ keyword }: Props) {
    const txt = useTranslations('Group_search');

    const { data: group, isLoading, isError } = useSearchGroupBySlug(keyword);

    if (!keyword.trim()) {
        return <SearchGroupEmpty title={txt('no_results')} />;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-56 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    {txt('loading')}
                </p>
            </div>
        );
    }

    if (isError || !group) {
        return (
            <SearchGroupEmpty
                title={txt('no_groups_found')}
                description={txt('try_another_keyword')}
            />
        );
    }

    return (
        <div className="space-y-3">
            <SearchGroupCard group={group} />
        </div>
    );
}
