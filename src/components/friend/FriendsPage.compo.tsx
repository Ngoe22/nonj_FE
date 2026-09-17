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

export default function FriendsPage() {
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Friends
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your friends and friend requests.
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
                        My Friends
                    </TabsTrigger>

                    <TabsTrigger value="outgoing">
                        Outgoing Req
                    </TabsTrigger>

                    <TabsTrigger value="incoming">
                        Incoming Req
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