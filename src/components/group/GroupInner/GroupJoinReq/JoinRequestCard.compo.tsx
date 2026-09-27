'use client';

import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {Group_Join_Request_Status, JoinRequest} from "@/types/group/join_request.type";



interface Props {
    request: JoinRequest;
    onApprove: (request: JoinRequest) => void;
    onReject: (request: JoinRequest) => void;
    isPending?: boolean;
}

export function JoinRequestCard({
                                    request,
                                    onApprove,
                                    onReject,
                                    isPending = false,
                                }: Props) {
    const txt = useTranslations('Group');

    const isPendingStatus = request.status === Group_Join_Request_Status.PENDING;

    console.log(request)


    return (
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Avatar */}
                <img
                    src={request.sender.avatar_url ?? '/default-avatar.png'}
                    alt={request.sender.user_name}
                    className="h-11 w-11 rounded-full object-cover"
                />

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <p className="font-medium">@{request.sender.user_name}</p>
                    <p className="text-sm text-muted-foreground">
                        {request.sender.nickname}
                    </p>
                </div>

                {/* Time */}
                <div className="text-sm text-muted-foreground">
                    {request.created_time}
                </div>

                {/* Status badge */}
                <StatusBadge status={request.status} />

                {/* Actions */}
                {isPendingStatus && (
                    <div className="flex gap-2">
                        {request.permission.approve && (
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => onApprove(request)}
                                className="flex items-center gap-1.5 rounded-xl bg-foreground px-3 py-2 text-sm text-background disabled:opacity-50"
                            >
                                <Check size={15} />
                                {txt('approve')}
                            </button>
                        )}

                        {request.permission.reject && (
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => onReject(request)}
                                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                                <X size={15} />
                                {txt('reject')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================
// Status Badge — tách nhỏ để tái sử dụng
// ============================================================
function StatusBadge({ status }: { status: Group_Join_Request_Status }) {
    const txt = useTranslations('Group');

    const styles: Record<Group_Join_Request_Status, string> = {
        [Group_Join_Request_Status.PENDING]:
            'bg-status-pending-bg text-status-pending',
        [Group_Join_Request_Status.APPROVED]:
            'bg-status-approved-bg text-status-approved',
        [Group_Join_Request_Status.REJECTED]:
            'bg-status-rejected-bg text-status-rejected',
    };

    const labels: Record<Group_Join_Request_Status, string> = {
        [Group_Join_Request_Status.PENDING]: txt('pending'),
        [Group_Join_Request_Status.APPROVED]: txt('approved'),
        [Group_Join_Request_Status.REJECTED]: txt('rejected'),
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
        >
      {labels[status]}
    </span>
    );
}