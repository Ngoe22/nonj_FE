'use client';

import { Check, X } from 'lucide-react';
import { joinrequestTest } from '@/mock/group';
import {useTranslations} from "next-intl";

export default function GroupJoinRequests() {

    const txt = useTranslations('Group')

    return (
        <div className="space-y-3 pt-6">
            {/*for each */}
            <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                        src={joinrequestTest.sender.avatar_url}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                        <p className="font-medium">
                            @{joinrequestTest.sender.user_name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                            {joinrequestTest.sender.nickname}
                        </p>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {joinrequestTest.created_time}
                    </div>

                    <span className="rounded-full bg-status-pending-bg px-3 py-1 text-xs font-medium text-status-pending">
                        {/*{joinrequestTest.status}*/}
                        { txt('pending') }
                    </span>

                    <div className="flex gap-2">
                        {joinrequestTest._permission
                            .approve && (
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl bg-foreground px-3 py-2 text-sm text-background"
                            >
                                <Check size={15} />
                                {txt('approve')}
                            </button>
                        )}

                        {joinrequestTest._permission
                            .reject && (
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <X size={15} />
                                {txt('reject')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}