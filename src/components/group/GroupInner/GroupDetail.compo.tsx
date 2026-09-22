'use client';

import {useEffect, useState} from 'react';
import { useParams } from 'next/navigation';
import GroupSubHeader from "@/components/group/GroupInner/GroupSubHeader.compo";
import GroupSettings from "@/components/group/GroupInner/GroupSetting/GroupSettings.compo";
import GroupJoinRequests from "@/components/group/GroupInner/GroupJoinReq/GroupJoinRequests.compo";
import GroupMembers from "@/components/group/GroupInner/GroupMember/GroupMembers.compo";
import GroupHeader from "@/components/group/GroupInner/GroupHeader.compo";
import GroupMenu from "@/components/group/GroupInner/GroupMenu.compo";
import CollectionList from "@/components/group/CollectionList/CollectionList.compo";
import CollectionModal from "@/components/group/CollectionList/CollectionModal.compo";
import ConfirmModal from "@/components/group/_share/ConfirmModal.compo";
import {useTranslations} from "next-intl";
import {useRouter} from "@/i18n/navigation";
import {useCurrentGroupStore} from "@/stores/group/currentGroup.store";

type View =
    | 'overview'
    | 'settings'
    | 'join_requests'
    | 'members';

export default function GroupDetail() {


    const router = useRouter();
    const currentGroup = useCurrentGroupStore((s) => s.currentGroup);

    useEffect(() => {
        if (!currentGroup) {
            router.replace('/group');
        }
    }, [currentGroup, router]);

    if (!currentGroup) return null;



    const params = useParams();
    const txt = useTranslations('Group')

    const groupId = String(params.groupId);
    const locale = String(params.locale);

    const [view, setView] =
        useState<View>('overview');

    const [menuOpen, setMenuOpen] =
        useState(false);

    const [createCollectionOpen, setCreateCollectionOpen] =
        useState(false);

    const [quitOpen, setQuitOpen] =
        useState(false);

    const [groupDeleteOpen, setGroupDeleteOpen] =
        useState(false);

    const canAddCollection = true;

    const goOverview = () => {
        setView('overview');
        setMenuOpen(false);
    };

    if (view !== 'overview') {

        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
                <GroupSubHeader
                    title={txt(view as string )}
                    onBack={goOverview}
                />

                {view === 'settings' && (
                    <GroupSettings
                        group={currentGroup}
                    />
                )}

                {view === 'join_requests' && (
                    <GroupJoinRequests />
                )}

                {view === 'members' && (
                    <GroupMembers />
                )}
            </div>
        );
    }

    return (
        <>
            <div className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
                <GroupHeader
                    group={currentGroup}
                    canAddCollection={canAddCollection}
                    onMenu={() =>
                        setMenuOpen((value) => !value)
                    }
                    onAddCollection={() =>
                        setCreateCollectionOpen(true)
                    }
                />

                <GroupMenu
                    open={menuOpen}
                    canViewSetting={
                        currentGroup.permission
                            .view_setting
                    }
                    canViewRequests={
                        currentGroup.permission
                            .view_join_req
                    }
                    canViewMembers={
                        currentGroup.permission
                            .view_member
                    }
                    AbleToLeave={
                        currentGroup.permission
                            .able_to_leave
                    }
                    AbleToDelete={
                        currentGroup.permission
                            .able_to_delete
                    }

                    onSettings={() =>
                        setView('settings')
                    }
                    onRequests={() =>
                        setView('join_requests')
                    }
                    onMembers={() =>
                        setView('members')
                    }
                    onQuit={() =>
                        setQuitOpen(true)
                    }
                    onDelete={() => setGroupDeleteOpen(true)
                    }
                />

                <CollectionList
                    locale={locale}
                    groupId={groupId}
                />
            </div>


            {/* Hidden Modal */}

            <CollectionModal
                open={createCollectionOpen}
                mode="create"
                onClose={() =>
                    setCreateCollectionOpen(false)
                }
                onSubmit={(data) => {
                    console.log(
                        'CREATE COLLECTION',
                        data
                    );

                    setCreateCollectionOpen(false);
                }}
            />

            <ConfirmModal
                open={quitOpen}
                title="Leave group"
                description="Are you sure you want to leave this group?"
                confirmText="Leave"
                onClose={() => setQuitOpen(false)}
                onConfirm={() => {
                    console.log('LEAVE GROUP');

                    setQuitOpen(false);
                }}
            />

            <ConfirmModal
                open={groupDeleteOpen}
                title="Leave group"
                description="Are you sure you want to leave this group?"
                confirmText="Leave"
                onClose={() => setGroupDeleteOpen(false)}
                onConfirm={() => {
                    console.log('LEAVE GROUP');

                    setGroupDeleteOpen(false);
                }}
            />
        </>
    );
}