'use client';

import { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import PreparationCard from '@/components/question_preparation/preparation/item/PreparationCard.compo';
import PreparationBuilderModal from '@/components/question_preparation/preparation/modal/PreparationBuilderModal.compo';
import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';
import ConfirmModal from '@/components/group/_share/ConfirmModal.compo';

import {
    useCreatePreparation,
    useDeletePreparation,
    useGetMyPreparations,
    useUpdatePreparation,
} from '@/hooks/question_preparation/question_preparation.hook';
import { usePreparationParams } from '@/hooks/question_preparation/use_preparation_params.hook';
import type { QuestionPreparationFormValues } from '@/schemas/question_preparation/question_preparation.schema';
import {
    splitQuestionSections,
    toFormValues,
    type QuestionPreparation,
} from '@/types/question_preparation/question_preparation.type';

export default function PreparationList() {
    const txt = useTranslations('Question_preparation');
    const { collectionId } = usePreparationParams();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetMyPreparations(collectionId);

    const createMutation = useCreatePreparation(collectionId);
    const updateMutation = useUpdatePreparation(collectionId);
    const deleteMutation = useDeletePreparation(collectionId);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<QuestionPreparation | null>(null);

    const preparations = data?.pages.flatMap((page) => page) ?? [];

    const handleCreate = async (values: QuestionPreparationFormValues) => {
        const { content, correct_answer } = splitQuestionSections(
            values.sections,
        );
        await createMutation.mutateAsync({
            title: values.title,
            collection: collectionId,
            content,
            correct_answer,
        });
        setCreateOpen(false);
    };

    const handleEdit = async (values: QuestionPreparationFormValues) => {
        if (!selected) return;
        const { content, correct_answer } = splitQuestionSections(
            values.sections,
        );
        await updateMutation.mutateAsync({
            collection_id: collectionId,
            preparation_id: selected.id,
            body: { title: values.title, content, correct_answer },
        });
        setEditOpen(false);
        setSelected(null);
    };

    const handleDelete = async () => {
        if (!selected) return;
        await deleteMutation.mutateAsync(selected.id);
        setDeleteOpen(false);
        setSelected(null);
    };

    // ⚠️ PHẢI memo — `toFormValues(...)` gọi thẳng trong JSX tạo object mới mỗi
    // render, từng làm modal reset form liên tục và nuốt nội dung đang gõ.
    const editInitialValues = useMemo(
        () => (selected ? toFormValues(selected) : undefined),
        [selected],
    );

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            {/* Header */}
            <div className="border-b border-border pb-5">
                <Link
                    href="/question_preparation"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    {txt('back')}
                </Link>

                <div className="mt-4 flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold">
                        {txt('preparations')}
                    </h1>

                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="flex shrink-0 items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background"
                    >
                        <Plus size={16} />
                        {txt('create_preparation')}
                    </button>
                </div>
            </div>

            {/* Danh sách đề */}
            <section className="mt-6">
                <InfiniteScrollList<QuestionPreparation>
                    items={preparations}
                    getKey={(preparation) => preparation.id}
                    renderItem={(preparation) => (
                        <PreparationCard
                            collectionId={collectionId}
                            preparation={preparation}
                            onEdit={() => {
                                setSelected(preparation);
                                setEditOpen(true);
                            }}
                            onDelete={() => {
                                setSelected(preparation);
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
                                {txt('no_preparations')}
                            </p>
                        </div>
                    }
                />
            </section>

            {/* Modals */}
            <PreparationBuilderModal
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
                isSubmitting={createMutation.isPending}
            />

            <PreparationBuilderModal
                open={editOpen}
                mode="edit"
                initialValues={editInitialValues}
                onClose={() => {
                    setEditOpen(false);
                    setSelected(null);
                }}
                onSubmit={handleEdit}
                isSubmitting={updateMutation.isPending}
            />

            <ConfirmModal
                open={deleteOpen}
                title={txt('confirm_delete_preparation')}
                description={txt('confirm_delete_preparation_desc', {
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
