'use client';

import { useTranslations } from 'next-intl';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import SearchGroupSearchTab from '@/components/group_search/SearchGroupSearchTab.compo';
import SearchGroupOutgoingTab from '@/components/group_search/JoinRequest/OutgoingRequestTab.compo';

/**
 * Shell của trang /group_search: chỉ có header + 2 tab.
 * Nội dung từng tab nằm ở component riêng để dễ debug:
 * - SearchGroupSearchTab  → search bar + kết quả (slug / name)
 * - SearchGroupOutgoingTab → danh sách request đã gửi
 */
export default function SearchGroupPage() {
    const txt = useTranslations('Group_search');

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    {txt('title')}
                </h1>
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

                <TabsContent value="search" className="mt-5">
                    <SearchGroupSearchTab />
                </TabsContent>

                <TabsContent value="outgoing" className="mt-5">
                    <SearchGroupOutgoingTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
