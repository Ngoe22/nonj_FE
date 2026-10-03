'use client';

import { ExternalLink, UserPlus, Loader2 } from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';

import {useCreateJoinRequest} from '@/hooks/group_search/group_join_request.hook';
import type {SearchGroup} from '@/types/group_search/group_search.type';
import {Group_Join_Mode, Group_View_Mode} from "@/enum/group/group_mode.enum";

interface Props {
    group: SearchGroup;
}

export default function SearchGroupCard({ group }: Props) {
    const txt = useTranslations('Group_search');
    const createRequest = useCreateJoinRequest();

    const handleJoinOrRequest = () => {
        createRequest.mutate({ group_id: group.id });
    };

    const isPending = createRequest.isPending;
    const hasPending = group.has_pending_request;
    const isJoined = group.is_joined;


    return (
        <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Info */}
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-foreground">
                        {group.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">@{group.slug}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {group.description}
                    </p>

                    {isJoined && (
                        <div className="mt-3">
                            <Badge variant="secondary">{txt('isMem')}</Badge>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    {/* Nút View  */}
                    {(isJoined || group.view_mode === Group_View_Mode.PUBLIC) && (
                        <Button asChild className="w-fit">
                            <Link href={`/group/${group.id}`} className="flex items-center justify-center gap-2">
                                <ExternalLink size={16} className="shrink-0" />
                                <span className="truncate">{txt('view_group_btn')}</span>
                            </Link>
                        </Button>
                    )}


                    {/* Chưa join + chưa gửi request */}
                    {!isJoined && !hasPending && (
                        <Button
                            type="button"
                            disabled={isPending}
                            onClick={handleJoinOrRequest}
                            className="w-fit"
                        >
                            {isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <UserPlus size={16} />
                            )}
                            {group.join_mode === Group_Join_Mode.PUBLIC
                                ? txt('join_now_btn')
                                : txt('request_to_join')}
                        </Button>
                    )}

                    {/* Đã gửi request */}
                    {!isJoined && hasPending && (
                        <Button
                            type="button"
                            variant="secondary"
                            disabled
                            className="w-full sm:w-36"
                        >
                            {txt('pending')}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}