'use client';

import { Clock, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FriendUserInfo from '@/components/friend/FriendUserInfo.compo';
import { useCancelFriendRequest } from '@/hooks/friend/friend.hook';
import { useCurrentFriendStore } from '@/stores/friend/current_friend.store';
import type { OutgoingFriendRequest } from '@/types/friend/friend.type';

interface Props {
    request: OutgoingFriendRequest;
}

export default function OutgoingRequestItem({ request }: Props) {
    const txt = useTranslations('Friend');
    const openModal = useCurrentFriendStore((s) => s.openModal);
    const cancelRequest = useCancelFriendRequest();

    const handleCancel = () => {
        cancelRequest.mutate({ request_id: request.id });
    };

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
                <FriendUserInfo
                    user={request.receiver}
                    onClick={() => openModal(request.receiver)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <div className="text-xs text-muted-foreground sm:text-right">
                    <p className="mt-1">
                        {txt('sent')} {request.created_at}
                    </p>
                </div>

                <Badge variant="secondary" className="gap-1">
                    <Clock size={13} />
                    {txt('pending')}
                </Badge>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={cancelRequest.isPending}
                >
                    <X size={15} />
                    {txt('cancel')}
                </Button>
            </div>
        </div>
    );
}