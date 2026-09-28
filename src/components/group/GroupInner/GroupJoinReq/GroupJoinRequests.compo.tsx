'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {useGetGroupJoinRequests, useUpdateJoinRequest} from "@/hooks/group/join_requests/join_request.hook";
import {Group_Join_Request_Status_UPDATE, JoinRequest} from "@/types/group/join_request.type";
import {InfiniteScrollList} from "@/components/_share/infinity_scroll/InfiniteScrollList.compo";
import {JoinRequestCard} from "@/components/group/GroupInner/GroupJoinReq/JoinRequestCard.compo";


export default function GroupJoinRequests() {

    const txt = useTranslations('Group');
    const params = useParams();
    const groupId = String(params?.groupId ?? '');

    // ============ Queries ============
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetGroupJoinRequests(groupId);

    const updateRequest = useUpdateJoinRequest(groupId);

    // ============ Flatten pages ============
    const requests = data?.pages.flatMap((p  ) => p) ?? [];

    // ============ Handlers ============
    const  handleApprove = async (request: JoinRequest) => {
        await updateRequest.mutateAsync({
            group_id: groupId,
            user_id: request.sender.id,
            join_request_id: request.id,
            body: {status: Group_Join_Request_Status_UPDATE.APPROVED},
        });
    };

    const handleReject = async (request: JoinRequest) => {
        await updateRequest.mutateAsync({
            group_id: groupId,
            user_id: request.sender.id,
            join_request_id: request.id,
            body: {status: Group_Join_Request_Status_UPDATE.REJECTED},
        });
    };

    // ============ Render ============
    return (
        <div className="pt-6">
            <InfiniteScrollList<JoinRequest>
                items={requests }
                getKey={(r) => r.id}
                renderItem={(request) => (
                    <JoinRequestCard
                        request={request}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        isPending={updateRequest.isPending}
                    />
                )}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                isLoading={isLoading}
                isError={isError}
                className="space-y-3"
            />
        </div>
    );
}