'use client';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import type { FriendUserWithBio } from '@/types/friend/friend.type';

interface Props {
    user: FriendUserWithBio;
    onClick?: () => void;
}

export default function FriendUserInfo({ user, onClick }: Props) {
    const content = (
        <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-11 w-11 shrink-0">
                <AvatarImage src={user.avatar_url ?? undefined} alt={user.user_name} />
                <AvatarFallback>
                    {user.nickname?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium text-foreground">
                    @{user.user_name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                    {user.nickname}
                </p>
            </div>
        </div>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="w-full rounded-lg transition hover:opacity-80"
            >
                {content}
            </button>
        );
    }

    return content;
}