'use client';

import { useState } from 'react';
import { ExternalLink, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {SearchGroupData} from "@/mock/group";
import {useTranslations} from "next-intl";




interface SearchGroupCardProps {
    group: SearchGroupData;
    onJoin: (groupId: string) => void;
    onRequest: (groupId: string) => void;
}

export default function SearchGroupCard({
                                            group,
                                            onJoin,
                                            onRequest,
                                        }: SearchGroupCardProps) {


   const txt = useTranslations('Group_search')

    const [joined, setJoined] =
        useState(group.isjoined);

    const [pending, setPending] =
        useState(false);

    const handleJoin = () => {
        setPending(true);

        // mock
        onJoin(group.id);

        // giả lập API success
        setJoined(true);
        setPending(false);
    };

    const handleRequest = () => {
        setPending(true);

        // mock
        onRequest(group.id);
    };

    return (
        <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-foreground">
                        {group.name}
                    </h3>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                        @{group.slug}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {group.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {/*<Badge variant="secondary">*/}
                        {/*    {group.view_mode}*/}
                        {/*</Badge>*/}

                        {/*<Badge variant="secondary">*/}
                        {/*    {group.join_mode}*/}
                        {/*</Badge>*/}

                        {joined && (
                            <Badge variant="secondary">
                                {txt('isMem')}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 gap-2 sm:flex-col sm:items-stretch">
                    {joined ?
                        ( // if join
                        <Button
                            asChild
                            className="w-full sm:w-36"
                        >
                            <a
                                href={`/group/${group.id}`}
                            >
                                <ExternalLink size={16} />
                                {txt('view_group_btn')}
                            </a>
                        </Button>
                    ) :
                    ( // if not join
                        <div
                            className={'flex flex-col gap-2 items-end'}
                        >
                            {
                                group.view_mode === 'PUBLIC' && <Button
                                    asChild
                                    className="w-full sm:w-36"
                                >
                                    <a
                                        href={`/group/${group.id}`}
                                    >
                                        <ExternalLink size={16} />
                                        {txt('view_group_btn')}
                                    </a>
                                </Button>

                            }
                            {
                                group.join_mode === 'BY_REQUEST' &&
                                <Button
                                    type="button"
                                    variant={
                                        pending
                                            ? 'secondary'
                                            : 'default'
                                    }
                                    disabled={pending}
                                    onClick={handleRequest}
                                    className="w-full "
                                >
                                    <UserPlus size={16} />
                                    {pending
                                        ? txt('pending')
                                        : txt('request_to_join')}
                                </Button>
                            }
                            {
                                group.join_mode === 'PUBLIC' &&
                                <Button
                                    type="button"
                                    disabled={pending}
                                    onClick={handleJoin}
                                    className="w-full sm:w-36"
                                >
                                    <UserPlus size={16} />
                                    {pending
                                        ? '.....'
                                        : txt('join_now_btn')}
                                </Button>
                            }
                        </div>
                    )
                    }
                </div>
            </div>
        </Card>
    );
}