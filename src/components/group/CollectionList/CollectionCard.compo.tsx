'use client';

import Link from 'next/link';
import { MoreVertical } from 'lucide-react';

interface CollectionCardProps {
    locale: string;
    groupId: string;
    collection: {
        id: string;
        title: string;
        desc: string;
        _permission: {
            delete: boolean;
            add: boolean;
            edit: boolean;
        };
    };
    onMenu: () => void;
}

export default function CollectionCard({
                                           locale,
                                           groupId,
                                           collection,
                                           onMenu,
                                       }: CollectionCardProps) {
    return (
        <div className="relative rounded-2xl border border-border bg-surface p-5">
            <Link
                href={`/${locale}/group/${groupId}/collection/${collection.id}`}
                className="block pr-10"
            >
                <h3 className="font-semibold text-foreground">
                    {collection.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {collection.desc}
                </p>
            </Link>

            <button
                type="button"
                onClick={onMenu}
                className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            >
                <MoreVertical size={18} />
            </button>
        </div>
    );
}