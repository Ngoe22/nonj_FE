'use client';

import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import FriendUserInfo from '@/components/friend/FriendUserInfo.compo';
import { useUpdateFriendRequest } from '@/hooks/friend/friend.hook';
import {
    Friend_Request_Status,
    UpdateRequestFromReceiverEnum,
} from '@/types/friend/friend.type';
import type { IngoingFriendRequest } from '@/types/friend/friend.type';
import {useCurrentFriendStore} from "@/stores/friend/check_user_profile.store";

interface Props {
    request: IngoingFriendRequest;
}

export default function IncomingRequestItem({ request }: Props) {
    const txt = useTranslations('Friend');
    const openModal = useCurrentFriendStore((s) => s.openModal);
    const updateRequest = useUpdateFriendRequest();

    const isPending = updateRequest.isPending;
    const isPendingStatus = request.status === Friend_Request_Status.PENDING;

    const handleAccept = () => {
        updateRequest.mutate({
            id: request.id,
            body: { status: UpdateRequestFromReceiverEnum.ACCEPTED },
        });
    };

    const handleReject = () => {
        updateRequest.mutate({
            id: request.id,
            body: { status: UpdateRequestFromReceiverEnum.REJECTED },
        });
    };

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
                <FriendUserInfo
                    user={request.sender}
                    onClick={() => openModal(request.sender)}
                />
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
                <div className="text-xs text-muted-foreground sm:text-right">
                    <p className="mt-1">
                        {txt('received_at')} {request.created_at}
                    </p>
                </div>

                {isPendingStatus && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleAccept}
                            disabled={isPending}
                        >
                            <Check size={15} />
                            {txt('accept')}
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleReject}
                            disabled={isPending}
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