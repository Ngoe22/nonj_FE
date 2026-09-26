'use client';

import { useTranslations } from 'next-intl';

import SearchGroupCard from '@/components/group_search/SearchGroupCard.compo';
import { useSearchGroupBySlug } from '@/hooks/group_search/group_search.hook';

interface Props {
    keyword: string;
}

export default function SearchGroupSlugResult({ keyword }: Props) {
    const txt = useTranslations('Group_search');

    const { data: group, isLoading, isError } = useSearchGroupBySlug(keyword);

    if (!keyword.trim()) {
        return (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">{txt('no_results')}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-56 items-center justify-center">
                <p className="text-sm text-muted-foreground">{txt('loading')}</p>
            </div>
        );
    }

    if (isError || !group) {
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
        <div className="space-y-3">
            <SearchGroupCard group={group} />
        </div>
    );
}