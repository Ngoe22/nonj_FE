'use client';

import { useTranslations } from 'next-intl';

import { Group_Member_Role } from '@/types/group_member/group_member.type';
import type { GroupMember } from '@/types/group_member/group_member.type';

interface Props {
    member: GroupMember;
    onPromote: (member: GroupMember) => void;
    onDemote: (member: GroupMember) => void;
    onKick: (member: GroupMember) => void;
    isPending?: boolean;
}

export function GroupMemberCard({
                                    member,
                                    onPromote,
                                    onDemote,
                                    onKick,
                                    isPending = false,
                                }: Props) {
    const txt = useTranslations('Group');

    const { _permission, role } = member;

    const isAdmin = role === Group_Member_Role.ADMIN;
    const isMember = role === Group_Member_Role.MEMBER;
    const isFounder = role === Group_Member_Role.FOUNDER;

    // ============================================================
    // Logic hiển thị button
    // ============================================================
    // ADMIN:  kick_admin → Kick | demote_admin → Demote
    // MEMBER: promote_mem → Promote | kick_mem → Kick
    // FOUNDER: không hiện gì (không kick/demote chính mình)
    // ============================================================
    const showKick = isAdmin
        ? _permission.kick_admin
        : isMember
            ? _permission.kick_mem
            : false;

    const showPromote = isMember ? _permission.promote_mem : false;
    const showDemote = isAdmin ? _permission.demote_admin : false;

    const hasAnyAction = showKick || showPromote || showDemote;

    return (
        <div className="relative flex flex-col gap-4 p-4 md:grid md:grid-cols-[auto_1fr_1fr_140px_100px_50px] md:items-center md:gap-4">
            {/* Avatar */}
            <img
                src={member.user.avatar_url ?? '/default-avatar.png'}
                alt={member.user.user_name}
                className="h-10 w-10 rounded-full object-cover"
            />

            {/* Username */}
            <div>
                <p className="text-sm font-medium">@{member.user.user_name}</p>
            </div>

            {/* Nickname */}
            <div className="text-sm text-muted-foreground">
                {member.user.nickname}
            </div>

            {/* Joined */}
            <div className="text-sm text-muted-foreground">
                {member.updated_at}
            </div>

            {/* Role badge */}
            <div>
                <RoleBadge role={role} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 md:col-span-full">
                {showKick && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => onKick(member)}
                        className="rounded-lg border border-border px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                        {txt('kick')}
                    </button>
                )}

                {showPromote && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => onPromote(member)}
                        className="rounded-lg border border-border px-3 py-2 text-xs hover:bg-surface-hover disabled:opacity-50"
                    >
                        {txt('promote')}
                    </button>
                )}

                {showDemote && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => onDemote(member)}
                        className="rounded-lg border border-border px-3 py-2 text-xs hover:bg-surface-hover disabled:opacity-50"
                    >
                        {txt('demote')}
                    </button>
                )}
            </div>
        </div>
    );
}

// ============================================================
// RoleBadge
// ============================================================
function RoleBadge({ role }: { role: Group_Member_Role }) {
    const txt = useTranslations('Group');

    const styles: Record<Group_Member_Role, string> = {
        [Group_Member_Role.FOUNDER]: 'bg-purple-100 text-purple-700',
        [Group_Member_Role.ADMIN]: 'bg-blue-100 text-blue-700',
        [Group_Member_Role.MEMBER]: 'bg-surface-hover text-foreground',
    };

    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[role]}`}
        >
      {txt(role)}
    </span>
    );
}