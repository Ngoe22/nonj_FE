'use client';

import { MoreVertical, Plus } from 'lucide-react';

interface GroupHeaderProps {
    group: {
        name: string;
        slug: string;
        description: string;
    };
    canAddCollection: boolean;
    onMenu: () => void;
    onAddCollection: () => void;
}

export default function GroupHeader({
                                        group,
                                        canAddCollection,
                                        onMenu,
                                        onAddCollection,
                                    }: GroupHeaderProps) {
    return (
        <div className="border-b border-border pb-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {group.name}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        @{group.slug}
                    </p>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {group.description}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onMenu}
                    className="shrink-0 rounded-xl p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                >
                    <MoreVertical size={20} />
                </button>
            </div>

            {canAddCollection && (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onAddCollection}
                        className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background"
                    >
                        <Plus size={17} />
                        New Collection
                    </button>
                </div>
            )}
        </div>
    );
}