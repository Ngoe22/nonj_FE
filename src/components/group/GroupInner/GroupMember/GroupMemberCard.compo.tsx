'use client';

import { useTranslations } from 'next-intl';
import {Group_Member_Role, GroupMember} from "@/types/group/group_member.type";
import {useRelativeTime} from "@/helper/timeFormat/relativeTime.helper";
import {formatLocalDateTime} from "@/helper/timeFormat/timezone.helper";



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
    const timeAgo = useRelativeTime();

    const { permission, role } = member;

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
        ? (permission?.kick_admin ?? false)
        : isMember
            ? (permission?.kick_mem ?? false)
            : false;

    const showPromote = isMember ? (permission?.promote_mem ?? false) : false;
    const showDemote = isAdmin ? (permission?.demote_admin ?? false) : false;

    const hasAnyAction = showKick || showPromote || showDemote;

    return (
        <div className="relative flex gap-3 p-4 justify-between items-center flex-wrap  border-b ">


            <div
                className={`flex items-center gap-8 w-2/6 md:w-2/6 `}
            >
                {/* Avatar */}
                <img
                    src={member.user.avatar_url ?? '/default-avatar.png'}
                    alt={member.user.user_name}
                    className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                    {/* Nickname */}
                    <div className="text-l ">
                        {member.user.nickname}
                    </div>

                    {/* Username */}
                    <p className="text-sm font-medium text-muted-foreground">
                        @{member.user.user_name}
                    </p>

                </div>

            </div>


            {/* Role badge */}
            <div className=" w-2/6 md:w-1/6 flex justify-end md:justify-center ">
                <RoleBadge role={role} />
            </div>

            {/* Joined */}
            <div className="text-sm text-muted-foreground w-2/6 md:w-1/6 ">
                { formatLocalDateTime(member.updated_at) }
            </div>



            {/* Actions */}
            {/* md:col-span-full */}
            <div className="flex flex-wrap shrink-0 gap-2 w-3/6 md:w-1/6 justify-end">
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