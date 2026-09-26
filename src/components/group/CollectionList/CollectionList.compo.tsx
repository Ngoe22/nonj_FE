'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import CollectionCard from '@/components/group/CollectionList/CollectionCard.compo';
import CollectionMenu from '@/components/group/CollectionList/CollectionMenu.compo';
import CollectionModal from '@/components/group/CollectionList/CollectionModal.compo';
import ConfirmModal from '@/components/group/_share/ConfirmModal.compo';
import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';

import {
    useGetCollections,
    useCreateCollection,
    useUpdateCollection,
    useDeleteCollection,
} from '@/hooks/post_collection/post_collection.hook';

import { useGetGroup } from '@/hooks/group/group_tan.hook';   // ⬅️ cần group để lấy permission
import type { Collection } from '@/types/post_collection/post_collection.type';
import type { CreateCollectionFormValues } from '@/schemas/post_collection/post_collection.schema';

interface Props {
    locale: string;
    groupId: string;
}

export default function CollectionList({ locale, groupId }: Props) {
    const txt = useTranslations('Post_collections');

    // ============ Queries ============
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetCollections(groupId);

    const { data: group } = useGetGroup(groupId);   // ⬅️ lấy group

    // ============ Mutations ============
    const createMutation = useCreateCollection(groupId);
    const updateMutation = useUpdateCollection(groupId);
    const deleteMutation = useDeleteCollection(groupId);

    // ============ Local state ============
    const [menuId, setMenuId] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<Collection | null>(null);

    // ============ Flatten pages ============
    const collections = data?.pages.flatMap((p) => p) ?? [];

    // ============ Permission ============
    const canAdd = group?.permission?.create_collection ?? false;   // ⬅️ từ group

    // ============ Handlers ============
    const handleCreate = async (values: CreateCollectionFormValues) => {
        await createMutation.mutateAsync(values);
        setCreateOpen(false);
    };

    const handleEdit = async (values: CreateCollectionFormValues) => {
        if (!selected) return;
        await updateMutation.mutateAsync({ id: selected.id, body: values });
        setEditOpen(false);
        setSelected(null);
    };

    const handleDelete = async () => {
        if (!selected) return;
        await deleteMutation.mutateAsync(selected.id);
        setDeleteOpen(false);
        setSelected(null);
    };

    // ============ Render ============
    return (
        <>
            <section className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{txt('title')}</h2>

                    {canAdd && (
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                        >
                            + {txt('new_collection')}
                        </button>
                    )}
                </div>

                <InfiniteScrollList<Collection>
                    items={collections}
                    getKey={(c) => c.id}
                    renderItem={(collection) => (
                        <div className="relative">
                            <CollectionCard
                                locale={locale}
                                groupId={groupId}
                                collection={collection}
                                onMenu={() =>
                                    setMenuId(menuId === collection.id ? null : collection.id)
                                }
                            />
                            <CollectionMenu
                                open={menuId === collection.id}
                                canEdit={collection.permission.edit}       // ⬅️ không còn _permission
                                canDelete={collection.permission.delete}   // ⬅️
                                onEdit={() => {
                                    setSelected(collection);
                                    setMenuId(null);
                                    setEditOpen(true);
                                }}
                                onDelete={() => {
                                    setSelected(collection);
                                    setMenuId(null);
                                    setDeleteOpen(true);
                                }}
                            />
                        </div>
                    )}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    isLoading={isLoading}
                    isError={isError}
                />
            </section>

            {/* Modals */}
            <CollectionModal
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
                isSubmitting={createMutation.isPending}
            />

            <CollectionModal
                open={editOpen}
                mode="edit"
                initialTitle={selected?.title ?? ''}
                initialDesc={selected?.desc ?? ''}
                onClose={() => {
                    setEditOpen(false);
                    setSelected(null);
                }}
                onSubmit={handleEdit}
                isSubmitting={updateMutation.isPending}
            />

            <ConfirmModal
                open={deleteOpen}
                title={txt('confirm_delete_title')}
                description={txt('confirm_delete_desc', {
                    title: selected?.title ?? '',
                })}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelected(null);
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}