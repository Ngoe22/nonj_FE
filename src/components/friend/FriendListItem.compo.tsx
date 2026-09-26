'use client';

import { useTranslations } from 'next-intl';

import FriendUserInfo from '@/components/friend/FriendUserInfo.compo';
import type { Friendship } from '@/types/friend/friend.type';
import {useCurrentFriendStore} from "@/stores/friend/check_user_profile.store";


// =======================================================


interface Props {
    friendship: Friendship;
}

export default function FriendListItem({ friendship }: Props) {
    const txt = useTranslations('Friend');
    const openModal = useCurrentFriendStore((s) => s.openModal);

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
                <FriendUserInfo
                    user={friendship.user_friend}
                    onClick={() => openModal(friendship.user_friend)}
                />
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-xs text-muted-foreground sm:text-right">
                    <p className="mt-1">
                        {txt('since')} {friendship.be_friend_at}
                    </p>
                </div>
            </div>
        </div>
    );
}