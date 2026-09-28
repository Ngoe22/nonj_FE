'use client';

import { useTranslations } from 'next-intl';

import UserInfo from '@/components/_share/user_info/UserInfo.compo';
import type { Friendship } from '@/types/friend/friend.type';
import {formatLocalDateTime} from "@/helper/timeFormat/timezone.helper";
import {UserMinus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useMemo} from "react";
import {useUnfriend} from "@/hooks/friend/friend.hook";

interface Props {
    friendship: Friendship;
}

export default function FriendListItem({ friendship }: Props) {
    const txt = useTranslations('Friend');
    const unfriend = useUnfriend()

    const onUnfriend = async ()=>{
       await  unfriend.mutateAsync( { friend_id : friendship.user_friend.id }  );
    }

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
                <UserInfo user={friendship.user_friend}  />
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                <p className="mt-1  text-xs text-muted-foreground sm:text-right">
                    {txt('since')} {formatLocalDateTime(friendship.be_friend_at)}
                </p>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onUnfriend}
                    className="shrink-0 text-red-600 hover:bg-red-50  hover:text-red-400"
                >
                    <UserMinus size={16} />
                    {txt('unfriend')}
                </Button>
            </div>
        </div>
    );
}