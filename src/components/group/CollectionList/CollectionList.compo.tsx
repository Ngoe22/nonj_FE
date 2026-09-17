'use client';

import { useState } from 'react';


import { testGroupCollectionData } from '@/mock/group';
import CollectionCard from "@/components/group/CollectionList/CollectionCard.compo";
import CollectionMenu from "@/components/group/CollectionList/CollectionMenu.compo";
import CollectionModal from "@/components/group/CollectionList/CollectionModal.compo";
import ConfirmModal from "@/components/group/_share/ConfirmModal.compo";

interface CollectionListProps {
    locale: string;
    groupId: string;
}

export default function CollectionList({locale, groupId}: CollectionListProps) {

    const [collections, setCollections] =
        useState([testGroupCollectionData]);

    const [menuId, setMenuId] = useState<string | null>(
        null
    );

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedCollection, setSelectedCollection] =
        useState<typeof testGroupCollectionData | null>(
            null
        );

    const [createOpen, setCreateOpen] = useState(false);

    const canAdd = collections.some(
        (item) => item._permission.add
    );

    const handleCreate = (data: {
        title: string;
        desc: string;
    }) => {
        console.log('CREATE COLLECTION', data);
        setCreateOpen(false);
    };

    const handleEdit = (data: {
        title: string;
        desc: string;
    }) => {
        if (!selectedCollection) {
            return;
        }

        // fake
        setCollections((prev) =>
            prev.map((item) =>
                item.id === selectedCollection.id
                    ? {
                        ...item,
                        title: data.title,
                        desc: data.desc,
                    }
                    : item
            )
        );

        setEditOpen(false);
    };

    const handleDelete = () => {
        if (!selectedCollection) {
            return;
        }

        setCollections((prev) =>
            prev.filter(
                (item) => item.id !== selectedCollection.id
            )
        );

        setDeleteOpen(false);
        setSelectedCollection(null);
    };

    return (
        <>
            <section className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Collections
                    </h2>

                    {canAdd && (
                        <button
                            type="button"
                            onClick={() =>
                                setCreateOpen(true)
                            }
                            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                        >
                            + New Collection
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            className="relative"
                        >
                            <CollectionCard
                                locale={locale}
                                groupId={groupId}
                                collection={collection}
                                onMenu={() => {
                                    setMenuId(
                                        menuId === collection.id
                                            ? null
                                            : collection.id
                                    );
                                }}
                            />

                            <CollectionMenu
                                open={
                                    menuId === collection.id
                                }
                                canEdit={
                                    collection._permission.edit
                                }
                                canDelete={
                                    collection._permission.delete
                                }
                                onEdit={() => {
                                    setSelectedCollection(
                                        collection
                                    );
                                    setMenuId(null);
                                    setEditOpen(true);
                                }}
                                onDelete={() => {
                                    setSelectedCollection(
                                        collection
                                    );
                                    setMenuId(null);
                                    setDeleteOpen(true);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>


            {/* Hidden modal */}
            <CollectionModal
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
            />

            <CollectionModal
                open={editOpen}
                mode="edit"
                initialTitle={
                    selectedCollection?.title ?? ''
                }
                initialDesc={selectedCollection?.desc ?? ''}
                onClose={() => {
                    setEditOpen(false);
                    setSelectedCollection(null);
                }}
                onSubmit={handleEdit}
            />

            <ConfirmModal
                open={deleteOpen}
                title="Delete collection"
                description={`Are you sure you want to delete "${selectedCollection?.title ?? ''}"?`}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedCollection(null);
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}