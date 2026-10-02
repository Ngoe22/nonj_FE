'use client';

import {
    LogOut,
    Settings,
    Users,
    UserPlus,
} from 'lucide-react';
import {useTranslations} from "next-intl";
import ReportButton from "@/components/_share/report/ReportButton.compo";
import { Target_Type } from "@/enum/report/report.enum";

interface GroupMenuProps {
    open: boolean;
    canViewSetting: boolean;
    canViewRequests: boolean;
    canViewMembers: boolean;
    AbleToLeave : boolean;
    AbleToDelete : boolean;
    onSettings: () => void;
    onRequests: () => void;
    onMembers: () => void;
    onQuit: () => void;
    onDelete : () => void;
    /** Id nhóm — để báo cáo vi phạm */
    groupId : string;
}

export default function GroupMenu({
                                      open,
                                      canViewSetting,
                                      canViewRequests,
                                      canViewMembers,
                                      AbleToLeave ,
                                      AbleToDelete,
                                      onSettings,
                                      onRequests,
                                      onMembers,
                                      onQuit,
                                      onDelete,
                                      groupId
                                  }: GroupMenuProps) {

   const txt = useTranslations('Group')

    if (!open) {
        return null;
    }

    return (
        <div className="absolute right-4 top-16 z-30 w-56 rounded-2xl border border-border bg-surface p-2 shadow-xl">
            {canViewSetting && (
                <button
                    type="button"
                    onClick={onSettings}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-surface-hover"
                >
                    <Settings size={17} />
                    {txt('settings')}
                </button>
            )}

            {canViewRequests && (
                <button
                    type="button"
                    onClick={onRequests}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-surface-hover"
                >
                    <UserPlus size={17} />
                    {txt('join_requests')}
                </button>
            )}
            {canViewMembers && (
                <button
                    type="button"
                    onClick={onMembers}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-surface-hover"
                >
                    <Users size={17} />
                    {txt('members')}
                </button>
            )}

            <div className="my-1 border-t border-border" />

            <ReportButton
                target_type={Target_Type.GROUP}
                target_id={groupId}
                variant="menu"
            />

            { AbleToLeave &&
                (<button
                    type="button"
                    onClick={onQuit}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                    <LogOut size={17} />
                    {txt('leave_group')}
                </button>)
            }

            { AbleToDelete &&
                (<button
                    type="button"
                    onClick={onDelete}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                    <LogOut size={17} />
                    {txt('delete_group')}
                </button>)
            }
        </div>
    );
}