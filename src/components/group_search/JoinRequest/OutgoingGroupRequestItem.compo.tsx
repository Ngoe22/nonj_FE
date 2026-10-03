'use client';

import { Clock3, Trash2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useCancelJoinRequest } from '@/hooks/group_search/group_join_request.hook';
import type { OutgoingJoinRequest } from '@/types/group_search/group_search.type';

interface Props {
    request: OutgoingJoinRequest;
}

export default function OutgoingGroupRequestItem({ request }: Props) {
    const txt = useTranslations('Group_search');
    const cancelMutation = useCancelJoinRequest();

    const handleCancel = () => {
        cancelMutation.mutate({
            join_request_id: request.id,
            group_id: request.group.id,
        });
    };

    const { group } = request;

    return (
        <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold">{group.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">@{group.slug}</p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <div className="text-xs text-muted-foreground sm:text-right">
                        <p>{txt('requested')}</p>
                        <p className="mt-1">{request.created_at}</p>
                    </div>

                    <Badge variant="secondary" className="gap-1">
                        <Clock3 size={13} />
                        {txt('pending')}
                    </Badge>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={cancelMutation.isPending}
                        onClick={handleCancel}
                        className="text-red-600 hover:bg-red-50 hover:text-red-500 focus:outline-none"
                    >
                        {cancelMutation.isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Trash2 size={14} />
                        )}
                        {txt('cancel_request')}
                    </Button>
                </div>
            </div>
        </Card>
    );
}