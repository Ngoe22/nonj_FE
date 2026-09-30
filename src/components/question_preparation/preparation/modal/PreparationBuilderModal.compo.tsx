'use client';

import { useEffect } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';

import {
    questionPreparationSchema,
    questionPreparationDefaultValues,
    type QuestionFormSectionValues,
    type QuestionPreparationFormInput,
    type QuestionPreparationFormValues,
} from '@/schemas/question_preparation/question_preparation.schema';
import { Question_Section_Type } from '@/enum/question_preparation/question_preparation.enum';
import {
    createEmptySection,
    type QuestionPreparationForm,
} from '@/types/question_preparation/question_preparation.type';
import { SectionBuilder } from './SectionBuilder.compo';

interface Props {
    open: boolean;
    mode?: 'create' | 'edit';
    /** Chỉ dùng khi mode = 'edit' — thường lấy từ `toFormValues(preparation)` */
    initialValues?: QuestionPreparationForm;
    onClose: () => void;
    onSubmit: (data: QuestionPreparationFormValues) => void | Promise<void>;
    isSubmitting?: boolean;
    /** Đổi tiêu đề modal khi tái sử dụng (vd: soạn nội dung bài tập trong nhóm) */
    titleOverride?: string;
}

export default function PreparationBuilderModal({
    open,
    mode = 'create',
    initialValues,
    onClose,
    onSubmit,
    isSubmitting = false,
    titleOverride,
}: Props) {
    const txt = useTranslations('Question_builder');

    const form = useForm<
        QuestionPreparationFormInput,
        unknown,
        QuestionPreparationFormValues
    >({
        resolver: zodResolver(questionPreparationSchema),
        defaultValues: questionPreparationDefaultValues,
        mode: 'onSubmit',
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const {
        fields: sections,
        append: addSection,
        remove: removeSection,
    } = useFieldArray({ control, name: 'sections' });

    // Nạp lại dữ liệu mỗi lần mở modal (create -> rỗng, edit -> đề đang sửa)
    useEffect(() => {
        if (!open) return;
        reset(initialValues ?? questionPreparationDefaultValues);
    }, [open, initialValues, reset]);

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-h-[90vh] w-11/12 max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {titleOverride ??
                            (mode === 'create'
                                ? txt('create_preparation')
                                : txt('edit_preparation'))}
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={submit} className="space-y-6">
                        {/* Tiêu đề đề */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                {txt('preparation_title')}
                            </label>
                            <Input
                                register={register('title')}
                                error={errors.title}
                                placeholder={txt(
                                    'preparation_title_placeholder',
                                )}
                            />
                        </div>

                        {/* Danh sách section */}
                        <div className="space-y-4">
                            {sections.map((section, index) => (
                                <SectionBuilder
                                    key={section.id}
                                    sectionIndex={index}
                                    onRemove={() => removeSection(index)}
                                />
                            ))}
                        </div>

                        {errors.sections?.root?.message && (
                            <p className="text-sm text-red-500">
                                {errors.sections.root.message}
                            </p>
                        )}

                        {/* Thêm section */}
                        <div className="flex flex-wrap justify-center gap-2 border-t border-dashed border-border pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    addSection(
                                        createEmptySection(
                                            Question_Section_Type.MULTIPLE_CHOICE,
                                        ) as QuestionFormSectionValues,
                                    )
                                }
                            >
                                <Plus size={14} />
                                {txt('add_multiple_choice')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    addSection(
                                        createEmptySection(
                                            Question_Section_Type.ESSAY,
                                        ) as QuestionFormSectionValues,
                                    )
                                }
                            >
                                <Plus size={14} />
                                {txt('add_essay')}
                            </Button>
                        </div>

                        {/* Hành động */}
                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                {txt('cancel')}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? txt('saving') : txt('confirm')}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
