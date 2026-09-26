'use client';

import { useTranslations } from 'next-intl';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import FriendSearch from '@/components/friend/FriendSearch.compo';
import FriendListItem from '@/components/friend/FriendListItem.compo';
import OutgoingRequestItem from '@/components/friend/OutgoingRequestItem.compo';
import IncomingRequestItem from '@/components/friend/IncomingRequestItem.compo';
import FriendDetailModal from '@/components/friend/FriendDetailModal.compo';
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

export default function FriendsPage() {
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

            <Tabs defaultValue="friends" className="mt-8">
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
            <FriendDetailModal />
        </div>
    );
}