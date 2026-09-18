'use client';

import { MoreVertical } from 'lucide-react';
import { member } from '@/mock/group';
import {useTranslations} from "next-intl";

export default function GroupMembers() {

    const txt = useTranslations('Group')

    return (
        <div className="pt-6">
            <div className="overflow-hidden rounded-2xl border border-border">
                <div className="hidden grid-cols-[auto_1fr_1fr_140px_100px_50px] gap-4 border-b border-border bg-surface-hover px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
                    <span />
                    <span>{txt('user')}</span>
                    <span>{txt('name_column')}</span>
                    <span>{txt('joined')}</span>
                    <span>{txt('role')}</span>
                    <span />
                </div>


                list
                <div className="relative flex flex-col gap-4 p-4 md:grid md:grid-cols-[auto_1fr_1fr_140px_100px_50px] md:items-center md:gap-4">
                    <img
                        src={member.user.avatar_url}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                    />

                    <div>
                        <p className="text-sm font-medium">
                            @{member.user.user_name}
                        </p>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {member.user.nickname}
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {member.updated_at}
                    </div>

                    <div>
                        <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs">
                            {/*{member.role}*/}
                            {txt( member.role as string )}
                        </span>
                    </div>

                    {/*<div className="relative">*/}
                    {/*    <button*/}
                    {/*        type="button"*/}
                    {/*        className="rounded-lg p-2 text-muted-foreground hover:bg-surface-hover"*/}
                    {/*    >*/}
                    {/*        <MoreVertical size={18} />*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    <div className="flex flex-wrap gap-2 md:col-span-full">
                        {member._permission.kick_mem && (
                            <button
                                type="button"
                                className="rounded-lg border border-border px-3 py-2 text-xs text-red-600"
                            >
                                {txt('kick')}
                            </button>
                        )}

                        {member._permission.promote_mem && (
                            <button
                                type="button"
                                className="rounded-lg border border-border px-3 py-2 text-xs"
                            >
                                {txt('promote')}
                            </button>
                        )}

                        {member._permission.demote_mem && (
                            <button
                                type="button"
                                className="rounded-lg border border-border px-3 py-2 text-xs"
                            >
                                {txt('demote')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}