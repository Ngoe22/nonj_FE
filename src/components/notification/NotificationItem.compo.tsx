'use client';

import {
    Bell,
    ClipboardCheck,
    Flag,
    ShieldCheck,
    UserCheck,
    UserMinus,
    UserPlus,
    Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { User_Notif_Type } from '@/enum/notification/notification.enum';
import type { AppNotification } from '@/types/notification/notification.type';
import { useRelativeTime } from '@/helper/timeFormat/relativeTime.helper';
import { notificationText } from '@/components/notification/notification.helper';

interface Props {
    notification: AppNotification;
    onSelect: (notification: AppNotification) => void;
}

/**
 * Component ở MỨC MODULE (không tạo trong render) — nếu gán
 * `const Icon = iconFor(type)` rồi dùng như JSX thì React sẽ coi đó là component
 * mới mỗi lần render và reset state (rule react-hooks/static-components).
 */
function NotifIcon({ type }: { type: User_Notif_Type }) {
    const size = 15;
    const className = 'text-muted-foreground';

    switch (type) {
        case User_Notif_Type.NEW_POST:
            return <ClipboardCheck size={size} className={className} />;
        case User_Notif_Type.GRADED_POST:
            return <ShieldCheck size={size} className={className} />;
        case User_Notif_Type.GROUP_JOIN_REQUEST:
        case User_Notif_Type.FRIEND_REQUEST:
        case User_Notif_Type.FRIEND_RESPONSE:
            return <UserPlus size={size} className={className} />;
        case User_Notif_Type.GROUP_JOIN_APPROVED:
            return <UserCheck size={size} className={className} />;
        case User_Notif_Type.GROUP_JOIN_REJECTED:
        case User_Notif_Type.GROUP_MEMBER_KICKED:
            return <UserMinus size={size} className={className} />;
        case User_Notif_Type.GROUP_MEMBER_ROLE_CHANGED:
            return <Users size={size} className={className} />;
        case User_Notif_Type.REPORT_RESOLVED:
        case User_Notif_Type.REPORT:
            return <Flag size={size} className={className} />;
        default:
            return <Bell size={size} className={className} />;
    }
}

export function NotificationItem({ notification, onSelect }: Props) {
    const txt = useTranslations('Notification');
    const relative = useRelativeTime();

    return (
        <button
            type="button"
            onClick={() => onSelect(notification)}
            className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition hover:bg-surface-hover ${
                notification.is_read ? '' : 'bg-surface-hover/60'
            }`}
        >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                <NotifIcon type={notification.type} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-sm leading-5 text-foreground">
                    {notificationText(notification, txt)}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {relative(notification.created_at)}
                </span>
            </span>

            {!notification.is_read && (
                <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-foreground"
                    aria-label={txt('unread')}
                />
            )}
        </button>
    );
}
