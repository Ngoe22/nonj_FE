'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import FriendSearch from '@/components/friend/friend/FriendSearch.compo';
import FriendListItem from '@/components/friend/friend/FriendListItem.compo';
import OutgoingRequestItem from '@/components/friend/outgoing/OutgoingRequestItem.compo';
import IncomingRequestItem from '@/components/friend/ingoing/IncomingRequestItem.compo';
import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';

import {
    useGetFriends,
    useGetOutgoingFriendRequests,
    useGetIngoingFriendRequests,
} from '@/hooks/friend/friend.hook';
import type {
    Friendship,
    OutgoingFriendRequest,
    IngoingFriendRequest,
} from '@/types/friend/friend.type';

const TAB_VALUES = ['friends', 'outgoing', 'incoming'] as const;
type TabValue = (typeof TAB_VALUES)[number];

export default function FriendsPage() {
    // Cho phép deep link từ thông báo: /friends?tab=incoming
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    const isTabValue = (value: string | null): value is TabValue =>
        (TAB_VALUES as readonly string[]).includes(value ?? '');

    const [tab, setTab] = useState<TabValue>(
        isTabValue(tabParam) ? tabParam : 'friends',
    );

    /*
     * Bấm thông báo khi đang Ở SẴN trang này chỉ đổi QUERY, component không
     * remount — nên `defaultValue` của Tabs bị bỏ qua và tab không đổi. Tự đồng
     * bộ lại mỗi khi param đổi (điều chỉnh state ngay trong render, đúng cách
     * React khuyến nghị cho trường hợp này).
     */
    const [syncedParam, setSyncedParam] = useState(tabParam);
    if (syncedParam !== tabParam) {
        setSyncedParam(tabParam);
        if (isTabValue(tabParam)) setTab(tabParam);
    }

    const pathname = usePathname();
    const router = useRouter();

    /**
     * Đổi tab thì đẩy luôn lên URL — hai chiều với deep link.
     *
     * Nếu chỉ đồng bộ một chiều (URL -> tab) thì bấm tab xong F5 lại về tab cũ,
     * và copy link gửi cho người khác cũng không đúng tab.
     */
    const changeTab = (next: TabValue) => {
        setTab(next);

        const params = new URLSearchParams(searchParams.toString());
        if (next === 'friends') params.delete('tab');
        else params.set('tab', next);

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    const txt = useTranslations('Friend');

    const friends = useGetFriends();
    const outgoing = useGetOutgoingFriendRequests();
    const ingoing = useGetIngoingFriendRequests();

    const friendList = friends.data?.pages.flatMap((p) => p) ?? [];
    const outgoingList = outgoing.data?.pages.flatMap((p) => p) ?? [];
    const ingoingList = ingoing.data?.pages.flatMap((p) => p) ?? [];

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{txt('title')}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {txt('description')}
                </p>
            </div>

            <div className="mt-6">
                <FriendSearch />
            </div>

            <Tabs
                value={tab}
                onValueChange={(value) => changeTab(value as TabValue)}
                className="mt-8"
            >
                <TabsList className="grid h-auto w-full grid-cols-3">
                    <TabsTrigger value="friends">{txt('my_friends')}</TabsTrigger>
                    <TabsTrigger value="outgoing">{txt('outgoing_req')}</TabsTrigger>
                    <TabsTrigger value="incoming">{txt('incoming_req')}</TabsTrigger>
                </TabsList>

                {/* FRIENDS */}
                <TabsContent value="friends" className="mt-5">
                    <InfiniteScrollList<Friendship>
                        items={friendList}
                        getKey={(f) => f.id}
                        renderItem={(friendship) => (
                            <FriendListItem friendship={friendship} />
                        )}
                        hasNextPage={friends.hasNextPage}
                        isFetchingNextPage={friends.isFetchingNextPage}
                        fetchNextPage={friends.fetchNextPage}
                        isLoading={friends.isLoading}
                        isError={friends.isError}
                        className="space-y-3"
                    />
                </TabsContent>

                {/* OUTGOING */}
                <TabsContent value="outgoing" className="mt-5">
                    <InfiniteScrollList<OutgoingFriendRequest>
                        items={outgoingList}
                        getKey={(r) => r.id}
                        renderItem={(request) => (
                            <OutgoingRequestItem request={request} />
                        )}
                        hasNextPage={outgoing.hasNextPage}
                        isFetchingNextPage={outgoing.isFetchingNextPage}
                        fetchNextPage={outgoing.fetchNextPage}
                        isLoading={outgoing.isLoading}
                        isError={outgoing.isError}
                        className="space-y-3"
                    />
                </TabsContent>

                {/* INCOMING */}
                <TabsContent value="incoming" className="mt-5">
                    <InfiniteScrollList<IngoingFriendRequest>
                        items={ingoingList}
                        getKey={(r) => r.id}
                        renderItem={(request) => (
                            <IncomingRequestItem request={request} />
                        )}
                        hasNextPage={ingoing.hasNextPage}
                        isFetchingNextPage={ingoing.isFetchingNextPage}
                        fetchNextPage={ingoing.fetchNextPage}
                        isLoading={ingoing.isLoading}
                        isError={ingoing.isError}
                        className="space-y-3"
                    />
                </TabsContent>
            </Tabs>

            {/* Modal xem thông tin user */}
            {/*<FriendDetailModal />*/}
        </div>
    );
}