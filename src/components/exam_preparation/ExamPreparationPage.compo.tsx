'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import ExamCollectionCard from '@/components/exam_preparation/ExamCollectionCard.compo';
import ExamCollectionModal from '@/components/exam_preparation/ExamCollectionModal.compo';
import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';

import {
    useGetMyCollections,
    useCreateCollection,
    useUpdateCollection,
    useDeleteCollection,
} from '@/hooks/exam_preparation/exam_preparation.hook';
import type { ExamCollection } from '@/types/exam_preparation/exam_preparation.type';
import type { CollectionFormValues } from '@/schemas/exam_preparation/exam_preparation.schema';
import ConfirmModal from "@/components/group/_share/ConfirmModal.compo";

export default function ExamPreparationPage() {
    const txt = useTranslations('Exam_preparation');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetMyCollections();

    const createMutation = useCreateCollection();
    const updateMutation = useUpdateCollection();
    const deleteMutation = useDeleteCollection();

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<ExamCollection | null>(null);

    const collections = data?.pages.flatMap((p) => p) ?? [];

    const handleCreate = async (values: CollectionFormValues) => {
        await createMutation.mutateAsync(values);
        setCreateOpen(false);
    };

    const handleEdit = async (values: CollectionFormValues) => {
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

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{txt('title')}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {txt('description')}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background"
                >
                    <Plus size={16} />
                    {txt('create_collection')}
                </button>
            </div>

            {/* List */}
            <div className="mt-6">
                <InfiniteScrollList<ExamCollection>
                    items={collections}
                    getKey={(c) => c.id}
                    renderItem={(collection) => (
                        <ExamCollectionCard
                            collection={collection}
                            onEdit={() => {
                                setSelected(collection);
                                setEditOpen(true);
                            }}
                            onDelete={() => {
                                setSelected(collection);
                                setDeleteOpen(true);
                            }}
                        />
                    )}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    isLoading={isLoading}
                    isError={isError}
                    className="space-y-3"
                    emptyComponent={
                        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
                            <p className="text-sm text-muted-foreground">
                                {txt('no_collections')}
                            </p>
                        </div>
                    }
                />
            </div>

            {/* Modals */}
            <ExamCollectionModal
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
                isSubmitting={createMutation.isPending}
            />

            <ExamCollectionModal
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
                title={txt('confirm_delete_collection')}
                description={txt('confirm_delete_collection_desc', {
                    title: selected?.title ?? '',
                })}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelected(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
}