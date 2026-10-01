'use client';

import {useEffect, useRef, useState} from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import GroupSubHeader from "@/components/group/GroupInner/main/GroupSubHeader.compo";
import GroupSettings from "@/components/group/GroupInner/GroupSetting/GroupSettings.compo";
import GroupJoinRequests from "@/components/group/GroupInner/GroupJoinReq/GroupJoinRequests.compo";
import GroupMembers from "@/components/group/GroupInner/GroupMember/GroupMembers.compo";
import GroupHeader from "@/components/group/GroupInner/main/GroupHeader.compo";
import GroupMenu from "@/components/group/GroupInner/main/GroupMenu.compo";
import CollectionList from "@/components/group/CollectionList/CollectionList.compo";
import CollectionModal from "@/components/group/CollectionList/CollectionModal.compo";
import ConfirmModal from "@/components/group/_share/ConfirmModal.compo";
import {useTranslations} from "next-intl";
import {toast} from "react-toastify";
import {useDeleteGroup, useGetGroup, useQuitGroup} from "@/hooks/group/group_tan.hook";
import {useCreateJoinRequest} from "@/hooks/group_search/group_join_request.hook";
import {AlertTriangle, UserPlus} from "lucide-react";
import {useQueryClient} from "@tanstack/react-query";
import {Group} from "@/types/group/group.type";


type View =
    | 'overview'
    | 'settings'
    | 'join_requests'
    | 'members';

export default  function GroupDetail() {


    const txt = useTranslations('Group')
    const toastTxt = useTranslations('Toast')


    const params = useParams();
    const groupId = String(params.groupId);
    const locale = String(params.locale);


    //

    const {
        data :currentGroup,
        isLoading,
        isError,
    } = useGetGroup(groupId);


    const queryClient = useQueryClient();
    const joinMutation = useCreateJoinRequest();

    const isMember = currentGroup?.permission?.is_member ?? true;
    const isByRequest = currentGroup?.join_mode === 'BY_REQUEST';

    // vào nhóm xong thì nạp lại thông tin nhóm để `is_member` chuyển true
    useEffect(() => {
        if (!joinMutation.isSuccess) return;
        queryClient.invalidateQueries({ queryKey: ['current_group', groupId] });
        queryClient.invalidateQueries({ queryKey: ['collections', groupId] });
    }, [joinMutation.isSuccess, queryClient, groupId]);

    const { mutate : deleteGroup } = useDeleteGroup()
    const deleteHandler = async () =>{

        // console.log(currentGroup)

        if(currentGroup?.id) {
            deleteGroup(currentGroup.id)
        } else {
            toast.error(toastTxt('action_fail'));
        }
        setGroupDeleteOpen(false);
    }

    const { mutate : quitGroup } = useQuitGroup()
    const quitHandler = async () =>{
        if(currentGroup?.id) {
            quitGroup(currentGroup.id)
        } else {
            toast.error(toastTxt('action_fail'));
        }
        setQuitOpen(false);
    }

    //


    // Cho phép deep link từ thông báo: /group/<id>?view=join_requests
    const searchParams = useSearchParams();
    const viewParam = searchParams.get('view');
    const isViewValue = (value: string | null): value is View =>
        value === 'overview' ||
        value === 'settings' ||
        value === 'join_requests' ||
        value === 'members';

    const [view, setView] = useState<View>(
        isViewValue(viewParam) ? viewParam : 'overview',
    );

    /*
     * Bấm thông báo khi đang Ở SẴN trang nhóm chỉ đổi QUERY (component không
     * remount) -> phải tự đồng bộ lại view, nếu không sẽ đứng nguyên ở tab cũ.
     */
    const [syncedViewParam, setSyncedViewParam] = useState(viewParam);
    if (syncedViewParam !== viewParam) {
        setSyncedViewParam(viewParam);
        if (isViewValue(viewParam)) setView(viewParam);
    }

    const pathname = usePathname();
    const router = useRouter();

    /**
     * Đổi mục đang xem thì đẩy luôn lên URL (hai chiều với deep link), để F5 và
     * link chia sẻ vẫn mở đúng mục.
     */
    const changeView = (next: View) => {
        setView(next);

        const params = new URLSearchParams(searchParams.toString());
        if (next === 'overview') params.delete('view');
        else params.set('view', next);

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

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
        changeView('overview');
        setMenuOpen(false);
    };

    if (!currentGroup) return <div>...</div>;


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
                        changeView('settings')
                    }
                    onRequests={() =>
                        changeView('join_requests')
                    }
                    onMembers={() =>
                        changeView('members')
                    }
                    onQuit={() =>
                        setQuitOpen(true)
                    }
                    onDelete={() => setGroupDeleteOpen(true)
                    }
                />

                {/*
                  Người NGOÀI nhóm (nhóm view_mode = PUBLIC) vẫn xem được nhóm và
                  bộ sưu tập, nhưng KHÔNG xem được bài tập — nội dung bài tập là
                  thứ tránh bị lấy đi. Hiện dải cảnh báo thay vì để họ bấm vào
                  rồi nhận lỗi khó hiểu.
                */}
                {!isMember && (
                    <div className="mb-4 flex flex-col gap-3 rounded-xl border-2 border-status-warning bg-status-warning-bg p-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 text-sm font-medium text-status-warning">
                            <AlertTriangle size={16} />
                            {txt('join_to_do_exercise')}
                        </p>
                        <button
                            type="button"
                            disabled={joinMutation.isPending}
                            onClick={() =>
                                joinMutation.mutate({ group_id: groupId })
                            }
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border-2 border-status-warning px-3 py-1.5 text-sm font-medium text-status-warning transition hover:bg-status-warning hover:text-white disabled:opacity-60"
                        >
                            <UserPlus size={14} />
                            {isByRequest
                                ? txt('request_to_join')
                                : txt('join_group')}
                        </button>
                    </div>
                )}

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
                    // console.log(
                    //     'CREATE COLLECTION',
                    //     data
                    // );

                    setCreateCollectionOpen(false);
                }}
            />

            <ConfirmModal
                open={ groupDeleteOpen}
                title={ txt('delete_group_title') }
                description={ txt('delete_group_desc') }
                onClose={() => setGroupDeleteOpen(false)}
                onConfirm={deleteHandler}
            />

            <ConfirmModal
                open={quitOpen}
                title={ txt('leave_group_title') }
                description= { txt('leave_group_desc') }
                onClose={() => setQuitOpen(false)}
                onConfirm={quitHandler}
            />
        </>
    );
}