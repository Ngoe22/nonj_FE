'use client';

import { useMemo } from 'react';



import type { SearchGroupMode } from './SearchGroupTypes';
import {testSearchGroups} from "@/mock/group";
import SearchGroupCard from "@/components/group_search/SearchGroupCard.compo";
import {useTranslations} from "next-intl";

interface SearchGroupResultsProps {
    keyword: string;
    mode: SearchGroupMode;
}

export default function SearchGroupResults({keyword, mode }: SearchGroupResultsProps) {

    const txt = useTranslations('Group_search')

    const groups = useMemo(() => {
        if (!keyword) {
            return [];
        }

        const normalized =
            keyword.toLowerCase();

        return testSearchGroups.filter((group) => {
            if (mode === 'slug') {
                return group.slug
                    .toLowerCase()
                    .includes(normalized);
            }

            return group.name
                .toLowerCase()
                .includes(normalized);
        });
    }, [keyword, mode]);

    if (!keyword) {
        return (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                    {txt('no_results')}
                </p>
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
                <div className="text-center">
                    <p className="text-sm font-medium">
                        {txt('no_groups_found')}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {txt('try_another_keyword')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {groups.map((group) => (
                <SearchGroupCard
                    key={group.id}
                    group={group}
                    onJoin={(groupId) => {
                        console.log(
                            'JOIN GROUP',
                            groupId
                        );
                    }}
                    onRequest={(groupId) => {
                        console.log(
                            'REQUEST TO JOIN GROUP',
                            groupId
                        );
                    }}
                />
            ))}
        </div>
    );
}