'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';

import { testGroupData } from '@/mock/group';
import GroupCard from "@/components/group/GroupList/GroupCard.compo";

type Tab = 'all' | 'my';

export default function GroupList() {
    const params = useParams();

    const locale = String(params.locale);

    const [tab, setTab] = useState<Tab>('all');

    const groups = useMemo(() => {
        const group = {
            id: testGroupData.id,
            name: testGroupData.name,
            slug: testGroupData.slug,
            description: testGroupData.description,
            join_mode: testGroupData.join_mode,
            view_mode: testGroupData.view_mode,
        };

        if (tab === 'my') {
            return [group];
        }

        return [group];
    }, [tab]);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Groups
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your groups and collections.
                    </p>
                </div>

                <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background"
                >
                    <Plus size={17} />
                    Create Group
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
                    All Groups
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
                    My Groups
                </button>
            </div>

            <div className="mt-6 grid gap-4">
                {groups.map((group) => (
                    <GroupCard
                        key={group.id}
                        locale={locale}
                        group={group}
                    />
                ))}
            </div>
        </div>
    );
}