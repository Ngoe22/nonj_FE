'use client';

import { useState } from 'react';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';



import type {
    SearchGroupMode,
} from './SearchGroupTypes';
import GroupSearchBar from "@/components/group_search/GroupSearchBar.compo";
import SearchGroupResults from "@/components/group_search/SearchGroupResults.compo";
import {outgoingGroupRequests} from "@/mock/group";
import OutgoingGroupRequestItem from "@/components/group_search/OutgoingGroupRequestItem.compo";



export default function SearchGroupPage() {
    const [searchMode, setSearchMode] =
        useState<SearchGroupMode>('slug');

    const [keyword, setKeyword] =
        useState('');

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Search Groups
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Find groups and manage your group requests.
                </p>
            </div>

            <Tabs
                defaultValue="search"
                className="mt-7"
            >
                <TabsList className="grid h-auto w-full grid-cols-2">
                    <TabsTrigger value="search">
                        Search
                    </TabsTrigger>

                    <TabsTrigger value="outgoing">
                        Outgoing to Group
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="search"
                    className="mt-5 space-y-5"
                >
                    <GroupSearchBar
                        mode={searchMode}
                        onModeChange={setSearchMode}
                        onSearch={setKeyword}
                    />

                    <SearchGroupResults
                        keyword={keyword}
                        mode={searchMode}
                    />
                </TabsContent>

                <TabsContent
                    value="outgoing"
                    className="mt-5"
                >
                    {outgoingGroupRequests.length ===
                    0 ? (
                        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
                            <p className="text-sm text-muted-foreground">
                                No outgoing group requests.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {outgoingGroupRequests.map(
                                (request) => (
                                    <OutgoingGroupRequestItem
                                        key={request.id}
                                        request={request}
                                    />
                                )
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}