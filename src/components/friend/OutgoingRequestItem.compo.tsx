'use client';

import {Clock, X} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import FriendUserInfo from "@/components/friend/FriendUserInfo.compo";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";


interface OutgoingRequestItemProps {
    request: {
        receiver: {
            id: string;
            user_name: string;
            nickname: string;
            avatar_url: string;
        };
        status: string;
        created_at: string;
    };
}

export default function OutgoingRequestItem({
                                                request,
                                            }: OutgoingRequestItemProps) {

    const txt = useTranslations('Friend')


    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
                <FriendUserInfo
                    user={request.receiver}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <div className="text-xs text-muted-foreground sm:text-right">
                    <p className="mt-1">
                        {txt('sent')}  {request.created_at}
                    </p>
                </div>

                <Badge
                    variant="secondary"
                    className="gap-1"
                >
                    <Clock size={13} />
                    {txt('pending')}
                    {/*{request.status}*/}
                </Badge>
                <Button
                    size="sm"
                    variant="outline"
                    // onClick={}
                >
                    <X size={15} />
                    {txt('cancel')}
                </Button>
            </div>
        </div>
    );
}