'use client';

import { Clock3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {OutgoingGroupRequest} from "@/mock/group";
import {useTranslations} from "next-intl";



interface OutgoingGroupRequestItemProps {
    request: OutgoingGroupRequest;
}

export default function OutgoingGroupRequestItem({
                                                     request,
                                                 }: OutgoingGroupRequestItemProps) {

    const txt = useTranslations('Group_search')

    const group = request.group;

    return (
        <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold">
                        {group.name}
                    </h3>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                        @{group.slug}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {group.description}
                    </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <div className="text-xs text-muted-foreground sm:text-right">
                        <p>Requested</p>

                        <p className="mt-1">
                            {request.created_at}
                        </p>
                    </div>

                    <Badge
                        variant="secondary"
                        className="gap-1"
                    >
                        <Clock3 size={13} />
                        {txt('pending')}
                        {/*{request.status}*/}
                    </Badge>
                </div>
            </div>
        </Card>
    );
}