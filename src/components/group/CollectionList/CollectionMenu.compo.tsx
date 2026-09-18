'use client';

import {useTranslations} from "next-intl";

interface CollectionMenuProps {
    open: boolean;
    canEdit: boolean;
    canDelete: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export default function CollectionMenu({
                                           open,
                                           canEdit,
                                           canDelete,
                                           onEdit,
                                           onDelete,
                                       }: CollectionMenuProps) {

    const txt = useTranslations('Post_collections')
    if (!open) {
        return null;
    }

    return (
        <div className="absolute right-4 top-12 z-20 w-36 rounded-xl border border-border bg-surface p-1.5 shadow-lg">
            {canEdit && (
                <button
                    type="button"
                    onClick={onEdit}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-hover"
                >
                    {txt('edit')}
                </button>
            )}

            {canDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                    {txt('delete')}
                </button>
            )}
        </div>
    );
}