'use client';

import { useTranslations } from 'next-intl';

import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';
import OutgoingGroupRequestItem from '@/components/group_search/JoinRequest/OutgoingGroupRequestItem.compo';
import SearchGroupEmpty from '@/components/group_search/Search/SearchResults/SearchGroupEmpty.compo';
import { useGetOutgoingRequests } from '@/hooks/group_search/outgoing_join_request.hook';
import type { OutgoingJoinRequest } from '@/types/group_search/group_search.type';

/**
 * Nội dung tab "Join group request" — array + phân trang
 * => InfiniteScrollList tự lo loading / error / rỗng.
 */
export default function SearchGroupOutgoingTab() {
    const txt = useTranslations('Group_search');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetOutgoingRequests();

    const requests = data?.pages.flatMap((page) => page) ?? [];

    return (
        <InfiniteScrollList<OutgoingJoinRequest>
            items={requests}
            getKey={(r) => r.id}
            renderItem={(request) => (
                <OutgoingGroupRequestItem request={request} />
            )}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
            isError={isError}
            className="space-y-3"
            emptyComponent={
                <SearchGroupEmpty title={txt('no_outgoing_requests')} />
            }
        />
    );
}
