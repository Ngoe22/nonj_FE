'use client';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';



import {
    friendList,
    outgoingReq,
    ingoingReq,
} from '@/mock/group';
import FriendSearch from "@/components/friend/FriendSearch.compo";
import FriendListItem from "@/components/friend/FriendListItem.compo";
import OutgoingRequestItem from "@/components/friend/OutgoingRequestItem.compo";
import IncomingRequestItem from "@/components/friend/IncomingRequestItem.compo";
import {useTranslations} from "next-intl";

export default function FriendsPage() {

    const txt = useTranslations('Friend')

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

            <div className="mt-6">
                <FriendSearch />
            </div>

            <Tabs
                defaultValue="friends"
                className="mt-8"
            >
                <TabsList className="grid h-auto w-full grid-cols-3">
                    <TabsTrigger value="friends">
                        {txt('my_friends')}
                    </TabsTrigger>

                    <TabsTrigger value="outgoing">
                        {txt('outgoing_req')}
                    </TabsTrigger>

                    <TabsTrigger value="incoming">
                        {txt('incoming_req')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="friends"
                    className="mt-5"
                >
                    <div className="space-y-3">
                        <FriendListItem
                            user={friendList.user_friend}
                            time={friendList.updated_at}
                        />
                    </div>
                </TabsContent>

                <TabsContent
                    value="outgoing"
                    className="mt-5"
                >
                    <div className="space-y-3">
                        <OutgoingRequestItem
                            request={outgoingReq}
                        />
                    </div>
                </TabsContent>

                <TabsContent
                    value="incoming"
                    className="mt-5"
                >
                    <div className="space-y-3">
                        <IncomingRequestItem
                            request={ingoingReq}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}