'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import GroupCard from "@/components/group/GroupList/GroupCard.compo";
import {useTranslations} from "next-intl";
import {useGetJoinedGroup} from "@/hooks/group/useGetGroupBy.hook";
import {CreateGroupModal} from "@/components/group/GroupList/GroupCreateModal.compo";

type Tab = 'all' | 'my';



export default function GroupList() {

    const txt = useTranslations('Group')

    const params = useParams();

    const locale = String(params.locale);

    const [tab, setTab] = useState<Tab>('all');
    const [ isCreating, setIsCreating ] = useState<boolean>(false);

    const myJoinedGroups = useGetJoinedGroup()
    const myMineGroups = useGetJoinedGroup()

    const groups = useMemo(() => {
        if (tab === 'my') return myMineGroups;
        return myJoinedGroups;
    }, [tab]);

    function handleCreateGroup() {
        console.log('create group');
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        {txt('title')}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {txt('description')}
                    </p>
                </div>

                <button
                    onClick={ ()=> setIsCreating(true) }
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background"
                >
                    <Plus size={17} />
                    {txt('create_group')}
                </button>
            </div>

            <div className="mt-6 flex w-fit rounded-xl bg-surface-hover p-1">
                <button
                    type="button"
                    onClick={() => setTab('all')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        tab === 'all'
                            ? 'bg-surface text-foreground shadow-sm'
                            : 'text-muted-foreground'
                    }`}
                >
                    {txt('all_groups')}
                </button>

                <button
                    type="button"
                    onClick={() => setTab('my')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        tab === 'my'
                            ? 'bg-surface text-foreground shadow-sm'
                            : 'text-muted-foreground'
                    }`}
                >
                    {txt('my_groups')}
                </button>
            </div>

            <div className="mt-6 grid gap-4">
                {/*{groups.map((group) => (*/}
                {/*    <GroupCard*/}
                {/*        key={group.id}*/}
                {/*        locale={locale}*/}
                {/*        group={group}*/}
                {/*    />*/}
                {/*))}*/}
            </div>


            <CreateGroupModal
                open={isCreating}
                onClose={() => setIsCreating(false)}
                onSubmit={handleCreateGroup}
                // isSubmitting={mutation.isPending}
            />


        </div>
    );
}