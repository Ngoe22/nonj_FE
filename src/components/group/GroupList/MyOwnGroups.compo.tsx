'use client';

import GroupCard from "@/components/group/GroupList/GroupCard.compo";
import {useParams} from "next/navigation";
import {useGetJoinedGroup, useGetOwnGroup} from "@/hooks/group/useGetMyGroup.hook";
import {InfiniteScrollList} from "@/components/group/_share/InfiniteScrollList.compo";

export function OwnGroupList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetOwnGroup();

    const groups = data?.pages.flatMap((page) => page) ?? [];

    const params = useParams();
    const locale = String(params.locale);


    return (
        <InfiniteScrollList
            items={groups}
            getKey={(group) => group.id}
            renderItem={(group) => <GroupCard group={group} locale={locale} />}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
            isError={isError}
            emptyComponent={
                <p className="py-10 text-center text-sm text-muted-foreground">
                    Bạn chưa tham gia nhóm nào +!
                </p>
            }
        />
    );
}