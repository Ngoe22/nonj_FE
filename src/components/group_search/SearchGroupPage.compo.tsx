'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import GroupSearchBar from '@/components/group_search/GroupSearchBar.compo';
import SearchGroupSlugResult from '@/components/group_search/SearchGroupSlugResult.compo';
import SearchGroupNameResults from '@/components/group_search/SearchGroupNameResults.compo';
import OutgoingGroupRequestItem from '@/components/group_search/OutgoingGroupRequestItem.compo';
import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';

import { useGetOutgoingRequests } from '@/hooks/group_search/group_search.hook';
import type {
    SearchGroupMode,
    OutgoingJoinRequest,
} from '@/types/group_search/group_search.type';

export default function SearchGroupPage() {
    const txt = useTranslations('Group_search');

    const [searchMode, setSearchMode] = useState<SearchGroupMode>('slug');
    const [keyword, setKeyword] = useState('');

    // Outgoing requests
    const {
        data: outgoingData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetOutgoingRequests();

    const requests = outgoingData?.pages.flatMap((p) => p) ?? [];

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{txt('title')}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {txt('description')}
                </p>
            </div>

            <Tabs defaultValue="search" className="mt-7">
                <TabsList className="grid h-auto w-full grid-cols-2">
                    <TabsTrigger value="search">{txt('search')}</TabsTrigger>
                    <TabsTrigger value="outgoing">
                        {txt('join_group_request')}
                    </TabsTrigger>
                </TabsList>

                {/* TAB SEARCH */}
                <TabsContent value="search" className="mt-5 space-y-5">
                    <GroupSearchBar
                        mode={searchMode}
                        onModeChange={setSearchMode}
                        onSearch={setKeyword}
                    />

                    {searchMode === 'slug' ? (
                        <SearchGroupSlugResult keyword={keyword} />
                    ) : (
                        <SearchGroupNameResults keyword={keyword} />
                    )}
                </TabsContent>

                {/* TAB OUTGOING */}
                <TabsContent value="outgoing" className="mt-5">
                    <InfiniteScrollList<OutgoingJoinRequest>
                        items={requests}
                        getKey={(r) => r.id}
                        renderItem={(request) => (
                            <OutgoingGroupRequestItem request={request} />
                        )}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        isLoading={isLoading}
                        isError={isError}
                        className="space-y-3"
                        emptyComponent={
                            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
                                <p className="text-sm text-muted-foreground">
                                    {txt('no_outgoing_requests')}
                                </p>
                            </div>
                        }
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}