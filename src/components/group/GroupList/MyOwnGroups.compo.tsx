'use client';

import GroupCard from "@/components/group/GroupList/GroupCard.compo";
import {useParams} from "next/navigation";
import {InfiniteScrollList} from "@/components/_share/infinity_scroll/InfiniteScrollList.compo";
import {useTranslations} from "next-intl";
import {useGetOwnGroups} from "@/hooks/group/group_tan.hook";




export function OwnGroupList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetOwnGroups();

    const groups = data?.pages.flatMap((page) => page) ?? [];

    const params = useParams();
    const locale = String(params.locale);
    const txt = useTranslations('Share_component')

    return (
        <InfiniteScrollList
            items={groups}
            getKey={(group) => group.id}
            renderItem={(group) => <GroupCard group={group} />}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
            isError={isError}
            emptyComponent={
                <p className="py-10 text-center text-sm text-muted-foreground">
                    {txt('infinity_scroll_group_have_not_owned_any')}
                </p>
            }
        />
    );
}