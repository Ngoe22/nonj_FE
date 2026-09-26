'use client';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUserModalStore } from '@/stores/user_info/user_modal.store';
import type { BasicUser } from '@/types/user_info/user_info.type';

type Size = 'sm' | 'md' | 'lg';
type Layout = 'row' | 'col';

interface Props {
    user: BasicUser;
    size?: Size;
    layout?: Layout;
    onClick?: () => void;
    disableClick?: boolean;
    subtitle?: string | null;
    className?: string;
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
                                     layout = 'row',
                                     onClick,
                                     disableClick = false,
                                     subtitle,
                                     className,
                                 }: Props) {
    const openModal = useUserModalStore((s) => s.openModal);
    const cfg = SIZE_CONFIG[size];

    const content = (
        <div
            className={cn(
                'flex min-w-0 gap-3',
                layout === 'row'
                    ? 'items-center'
                    : 'flex-col items-center text-center',
                className,
            )}
        >
            <Avatar className={cn('shrink-0', cfg.avatar)}>
                <AvatarImage src={user.avatar_url ?? undefined} alt={user.user_name} />
                <AvatarFallback className={cfg.fallback}>
                    {user.nickname?.charAt(0).toUpperCase() ?? '?'}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
                <p className={cn('truncate font-medium text-foreground', cfg.name)}>
                    @{user.user_name}
                </p>
                <p className={cn('truncate text-muted-foreground', cfg.sub)}>
                    {user.nickname}
                </p>

                {subtitle && (
                    <p
                        className={cn(
                            'mt-1 line-clamp-1 text-muted-foreground',
                            cfg.sub,
                        )}
                    >
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );

    if (disableClick) return content;

    const handleClick = onClick ?? (() => openModal(user));

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-full rounded-lg text-left transition hover:opacity-80"
        >
            {content}
        </button>
    );
}