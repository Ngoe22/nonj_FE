'use client';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';

interface FriendUserInfoProps {
    user: {
        id: string;
        user_name: string;
        nickname: string;
        avatar_url: string;
    };
}

export default function FriendUserInfo({
                                           user,
                                       }: FriendUserInfoProps) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-11 w-11 shrink-0">
                <AvatarImage
                    src={user.avatar_url}
                    alt={user.user_name}
                />

                <AvatarFallback>
                    {user.nickname
                        ?.charAt(0)
                        .toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                    @{user.user_name}
                </p>

                <p className="truncate text-sm text-muted-foreground">
                    {user.nickname}
                </p>
            </div>
        </div>
    );
}