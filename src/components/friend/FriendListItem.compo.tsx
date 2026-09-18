'use client';



import FriendUserInfo from "@/components/friend/FriendUserInfo.compo";
import {useTranslations} from "next-intl";

interface FriendListItemProps {
    user: {
        id: string;
        user_name: string;
        nickname: string;
        avatar_url: string;
    };
    time: string;
    label?: string;
}

export default function FriendListItem({
                                           user,
                                           time,
                                           label = 'Friend',
                                       }: FriendListItemProps) {

    const txt = useTranslations('Friend')

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
                <FriendUserInfo user={user} />
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-xs text-muted-foreground sm:text-right">
                      <p className="mt-1"> {txt('since')} {time}</p>
                </div>
            </div>
        </div>
    );
}