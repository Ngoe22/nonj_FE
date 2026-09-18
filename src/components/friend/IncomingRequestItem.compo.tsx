'use client';

import { useState } from 'react';
import {
    Check,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FriendUserInfo from "@/components/friend/FriendUserInfo.compo";
import {useTranslations} from "next-intl";


interface IncomingRequestItemProps {
    request: {
        sender: {
            id: string;
            user_name: string;
            nickname: string;
            avatar_url: string;
        };
        status: string;
        created_at: string;
    };
}

export default function IncomingRequestItem({
                                                request,
                                            }: IncomingRequestItemProps) {


    const txt = useTranslations('Friend')

    const [status, setStatus] = useState<
        'pending' | 'accepted' | 'rejected'
    >(request.status as
        | 'pending'
        | 'accepted'
        | 'rejected');

    const handleAccept = () => {
        // Mock API
        setStatus('accepted');
    };

    const handleReject = () => {
        // Mock API
        setStatus('rejected');
    };

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
                <FriendUserInfo
                    user={request.sender}
                />
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="text-xs text-muted-foreground sm:text-right">
                        <p className="mt-1">
                            {txt('received_at')} {request.created_at}
                        </p>
                    </div>

                    {/*<Badge variant="secondary">*/}
                    {/*    {txt( status as string )}*/}
                    {/*    /!*{status}*!/*/}
                    {/*</Badge>*/}
                </div>

                {status === 'pending' && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleAccept}
                        >
                            <Check size={15} />
                            {txt('accept')}
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleReject}
                        >
                            <X size={15} />
                            {txt('reject')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}