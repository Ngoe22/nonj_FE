'use client';

import {
    LogOut,
    Settings,
    Users,
    UserPlus,
} from 'lucide-react';

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
    onDelete : () => void
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
                                      onDelete
                                  }: GroupMenuProps) {
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
                    Settings
                </button>
            )}

            {canViewRequests && (
                <button
                    type="button"
                    onClick={onRequests}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-surface-hover"
                >
                    <UserPlus size={17} />
                    Join Requests
                </button>
            )}
            {canViewMembers && (
                <button
                    type="button"
                    onClick={onMembers}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-surface-hover"
                >
                    <Users size={17} />
                    Members
                </button>
            )}

            <div className="my-1 border-t border-border" />

            { AbleToLeave &&
                (<button
                    type="button"
                    onClick={onQuit}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                    <LogOut size={17} />
                    Leave Group
                </button>)
            }

            { AbleToDelete &&
                (<button
                    type="button"
                    onClick={onDelete}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                    <LogOut size={17} />
                    Delete Group
                </button>)
            }
        </div>
    );
}