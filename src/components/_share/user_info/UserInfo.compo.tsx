'use client';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { BasicUser } from '@/types/user_info/user_info.type';

type Size = 'sm' | 'md' | 'lg';

interface Props <T extends BasicUser = BasicUser> {
    user: T;
    size?: Size;
    className?: string;
    children?: React.ReactNode;
}

const SIZE_CONFIG: Record<
    Size,
    { avatar: string; fallback: string; name: string; sub: string }
> = {
    sm: { avatar: 'h-8 w-8', fallback: 'text-xs', name: 'text-xs', sub: 'text-xs' },
    md: { avatar: 'h-11 w-11', fallback: 'text-sm', name: 'text-sm', sub: 'text-sm' },
    lg: { avatar: 'h-20 w-20', fallback: 'text-2xl', name: 'text-lg', sub: 'text-sm' },
};

export default function UserInfo({
                                     user,
                                     size = 'md',
                                     className,
                                     children
                                 }: Props) {

    const cfg = SIZE_CONFIG[size];

    return (
        <div
            className={  className ? className : `flex gap-3 items-center`}
        >
            <Avatar className={cn('shrink-0', cfg.avatar)}>
                <AvatarImage src={user.avatar_url ?? undefined} alt={user.user_name} />
                <AvatarFallback className={cfg.fallback}>
                    {user.nickname?.charAt(0).toUpperCase() ?? '?'}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0 w-full">
                <p className={cn('truncate font-medium text-foreground', cfg.name)}>
                    {user.nickname}
                </p>
                <p className={cn('truncate text-muted-foreground', cfg.sub)}>
                    @{user.user_name}
                </p>
            </div>

            {children}
        </div>
    );


}