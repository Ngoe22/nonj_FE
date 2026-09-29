'use client';

import { useState } from 'react';
import {Link} from '@/i18n/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import ExamTemplateCard from '@/components/exam_preparation/exam/item/ExamTemplateCard.compo';
import ExamTemplateModal from '@/components/exam_preparation/exam/modal/ExamTemplateModal.compo';
import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';

import {
    useGetMyTemplates,
    useCreateTemplate,
    useUpdateTemplate,
    useDeleteTemplate,
} from '@/hooks/exam_preparation/exam_preparation.hook';

import type {AnswerSection, ExamTemplate} from '@/types/exam_preparation/exam_preparation.type';
import type { TemplateFormValues } from '@/schemas/exam_preparation/exam_preparation.schema';
import ConfirmModal from "@/components/group/_share/ConfirmModal.compo";
import {useExamParams} from "@/hooks/exam_preparation/use_exam_params.hook";
import ExamPreparationCreateModal from "@/components/exam_preparation/exam/modal/ExamPreparationCreatModal.compo";


// ===============================

export default function ExamPreparationList() {
    const txt = useTranslations('Exam_preparation');
    const { collectionId } = useExamParams();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetMyTemplates(collectionId);

    const createMutation = useCreateTemplate(collectionId);
    // const updateMutation = useUpdateTemplate();
    const deleteMutation = useDeleteTemplate();

    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<ExamTemplate | null>(null);


    //

    const templates = data?.pages.flatMap((p) => p) ?? [];

    const handleCreate = async (values: TemplateFormValues) => {
        await createMutation.mutateAsync({
            title: values.title,
            exercise_content: [],
            correct_answer : []
        });
        setCreateOpen(false);
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
            <div className="border-b border-border pb-5">
                <Link
                    href="/exam_preparation"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    {txt('back')}
                </Link>

                <div className="mt-4 flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold">{txt('exams')}</h1>

                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="flex shrink-0 items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background"
                    >
                        <Plus size={16} />
                        {txt('create_template')}
                    </button>
                </div>
            </div>

            {/* List */}
            <section className="mt-6">
                <InfiniteScrollList<ExamTemplate>
                    items={templates}
                    getKey={(t) => t.id}
                    renderItem={(template) => (
                        <ExamTemplateCard
                            collectionId={collectionId}
                            template={template}
                            onDelete={() => {
                                setSelected(template);
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
                                {txt('no_templates')}
                            </p>
                        </div>
                    }
                />
            </section>

            {/* Modals */}
            {/*<ExamTemplateModal*/}
            {/*    open={createOpen}*/}
            {/*    mode="create"*/}
            {/*    onClose={() => setCreateOpen(false)}*/}
            {/*    onSubmit={handleCreate}*/}
            {/*    isSubmitting={createMutation.isPending}*/}
            {/*/>*/}

            {/*<ExamTemplateModal*/}
            {/*    open={editOpen}*/}
            {/*    mode="edit"*/}
            {/*    initialTitle={selected?.title ?? ''}*/}
            {/*    onClose={() => {*/}
            {/*        setEditOpen(false);*/}
            {/*        setSelected(null);*/}
            {/*    }}*/}
            {/*    onSubmit={handleEdit}*/}
            {/*    isSubmitting={updateMutation.isPending}*/}
            {/*/>*/}

            <ExamPreparationCreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
            />

            <ConfirmModal
                open={deleteOpen}
                title={txt('confirm_delete_template')}
                description={txt('confirm_delete_template_desc', {
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