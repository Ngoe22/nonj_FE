'use client';

import { useMemo, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Layers, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/group/_share/ConfirmModal.compo';
import PreparationBuilderModal from '@/components/question_preparation/preparation/modal/PreparationBuilderModal.compo';
import { SectionView } from '@/components/question_preparation/preparation/detail/SectionView.compo';

import { usePreparationParams } from '@/hooks/question_preparation/use_preparation_params.hook';
import {
    useDeletePreparation,
    useGetMyPreparation,
    useUpdatePreparation,
} from '@/hooks/question_preparation/question_preparation.hook';
import { formatDate } from '@/lib/format/date';
import type { QuestionPreparationFormValues } from '@/schemas/question_preparation/question_preparation.schema';
import {
    getSectionAnswer,
    splitQuestionSections,
    toFormValues,
} from '@/types/question_preparation/question_preparation.type';

export default function PreparationDetail() {
    const txt = useTranslations('Question_preparation');
    const router = useRouter();
    const { collectionId, preparationId } = usePreparationParams();

    const { data: preparation, isLoading, isError } = useGetMyPreparation({
        collectionId,
        preparationId,
    });

    const updateMutation = useUpdatePreparation(collectionId);
    const deleteMutation = useDeletePreparation(collectionId);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    /**
     * Giá trị khởi tạo cho modal Sửa.
     *
     * ⚠️ PHẢI memo VÀ phải đặt TRƯỚC các `return` sớm (Rules of Hooks).
     * `toFormValues(...)` gọi thẳng trong JSX tạo object mới mỗi render -> modal
     * reset form liên tục -> ô hiện chữ nhưng RHF tưởng rỗng.
     */
    const editInitialValues = useMemo(
        () => (preparation ? toFormValues(preparation) : undefined),
        [preparation],
    );

    // ---------------- Trạng thái tải ----------------

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
                <p className="text-sm text-muted-foreground">
                    {txt('loading')}
                </p>
            </div>
        );
    }

    if (isError || !preparation) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
                <Link
                    href={`/question_preparation/${collectionId}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    {txt('back')}
                </Link>

                <p className="mt-6 text-sm text-muted-foreground">
                    {txt('preparation_not_found')}
                </p>
            </div>
        );
    }

    const sections = preparation.content ?? [];

    // ---------------- Hành động ----------------

    const handleEdit = async (values: QuestionPreparationFormValues) => {
        const { content, correct_answer } = splitQuestionSections(
            values.sections,
        );
        await updateMutation.mutateAsync({
            collection_id: collectionId,
            preparation_id: preparation.id,
            body: { title: values.title, content, correct_answer },
        });
        setEditOpen(false);
    };

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(preparation.id);
        setDeleteOpen(false);
        router.push(`/question_preparation/${collectionId}`);
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            {/* ================= Header ================= */}
            <div className="border-b border-border pb-5">
                <Link
                    href={`/question_preparation/${collectionId}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    {txt('back')}
                </Link>

                <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold">{preparation.title}</h1>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">
                                {formatDate(preparation.created_at)}
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <Layers size={12} />
                                {sections.length} {txt('section_unit')}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={() => setEditOpen(true)}
                        >
                            <Pencil size={14} />
                            {txt('edit')}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2 text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 size={14} />
                            {txt('delete')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* ================= Nội dung đề ================= */}
            <section className="mt-8">
                <h2 className="text-lg font-semibold">
                    {txt('exercise_content')}
                </h2>

                {sections.length === 0 ? (
                    <div className="mt-4 flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">
                            {txt('no_sections')}
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        {sections.map((section, sectionIndex) => (
                            <SectionView
                                key={sectionIndex}
                                index={sectionIndex}
                                section={section}
                                allAnswers={preparation.correct_answer}
                                answer={getSectionAnswer(
                                    preparation.correct_answer,
                                    sectionIndex,
                                )}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ================= Modals ================= */}
            <PreparationBuilderModal
                open={editOpen}
                mode="edit"
                initialValues={editInitialValues}
                onClose={() => setEditOpen(false)}
                onSubmit={handleEdit}
                isSubmitting={updateMutation.isPending}
            />

            <ConfirmModal
                open={deleteOpen}
                title={txt('confirm_delete_preparation')}
                description={txt('confirm_delete_preparation_desc', {
                    title: preparation.title,
                })}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
