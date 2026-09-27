'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {useGetGroupMembers, useKickGroupMember, useUpdateGroupMember} from "@/hooks/group/member/group_member.hook";
import {GroupMember, GroupMemberUpdateAction, Group_Member_Role} from "@/types/group/group_member.type";
import {InfiniteScrollList} from "@/components/_share/infinity_scroll/InfiniteScrollList.compo";
import {GroupMemberCard} from "@/components/group/GroupInner/GroupMember/GroupMemberCard.compo";
import ConfirmModal from "@/components/group/_share/ConfirmModal.compo";



export default function GroupMembers() {
    const txt = useTranslations('Group');
    const params = useParams();
    const groupId = String(params?.groupId ?? '');

    // ============ Queries ============
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetGroupMembers(groupId);

    // ============ Mutations ============
    const updateMember = useUpdateGroupMember(groupId);
    const kickMember = useKickGroupMember(groupId);

    // ============ Local state cho confirm kick ============
    const [kickTarget, setKickTarget] = useState<GroupMember | null>(null);

    // ============ Flatten pages ============
    const members = data?.pages.flatMap((p) => p) ?? [];

    // ============ Handlers ============
    const handlePromote = (member: GroupMember) => {
        updateMember.mutate({
            group_id: groupId,
            target_id: member.user.id,
            action: GroupMemberUpdateAction.PROMOTE,
        });
    };

    const handleDemote = (member: GroupMember) => {
        updateMember.mutate({
            group_id: groupId,
            target_id: member.user.id,
            action: GroupMemberUpdateAction.DEMOTE,
        });
    };

    const handleKickClick = (member: GroupMember) => {
        setKickTarget(member);
    };

    const handleKickConfirm = async () => {
        if (!kickTarget) return;

        // BE: kickMember (DELETE kick/:gid/:uid) CHỈ cho target là MEMBER.
        // Muốn xoá một ADMIN thì phải dùng REMOVE_ADMIN (founderRemoveAdmin),
        // nếu không BE trả 404 target_role_not_allowed_in_group.
        if (kickTarget.role === Group_Member_Role.ADMIN) {
            await updateMember.mutateAsync({
                group_id: groupId,
                target_id: kickTarget.user.id,
                action: GroupMemberUpdateAction.REMOVE_ADMIN,
            });
        } else {
            await kickMember.mutateAsync({
                group_id: groupId,
                user_id: kickTarget.user.id,
                member_id: kickTarget.id,
            });
        }

        setKickTarget(null);
    };

    const isPending = updateMember.isPending || kickMember.isPending;

    // ============ Render ============
    return (
        <div className="pt-6">
            <div className="overflow-hidden rounded-2xl border border-border">
                {/* Header — chỉ hiện trên desktop */}
                <div className="hidden grid-cols-[auto_1fr_1fr_140px_100px_50px] gap-4 border-b border-border bg-surface-hover px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
                    <span />
                    <span>{txt('user')}</span>
                    <span>{txt('name_column')}</span>
                    <span>{txt('joined')}</span>
                    <span>{txt('role')}</span>
                    <span />
                </div>

                {/* List với infinite scroll */}
                <InfiniteScrollList<GroupMember>
                    items={members}
                    getKey={(m) => m.id}
                    renderItem={(member) => (
                        <GroupMemberCard
                            member={member}
                            onPromote={handlePromote}
                            onDemote={handleDemote}
                            onKick={handleKickClick}
                            isPending={isPending}
                        />
                    )}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    isLoading={isLoading}
                    isError={isError}
                    className=""
                    emptyComponent={
                        <p className="py-10 text-center text-sm text-muted-foreground">
                            {txt('no_members')}
                        </p>
                    }
                />
            </div>

            {/* Confirm kick modal */}
            <ConfirmModal
                open={!!kickTarget}
                title={txt('confirm_kick_title')}
                description={txt('confirm_kick_desc', {
                    name: kickTarget?.user.user_name ?? '',
                })}
                onClose={() => setKickTarget(null)}
                onConfirm={handleKickConfirm}
            />
        </div>
    );
}