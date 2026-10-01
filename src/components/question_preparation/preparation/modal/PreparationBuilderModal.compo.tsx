'use client';

import { useEffect } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertCircle, Plus } from 'lucide-react';

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
import {
    collectErrorKeys,
    translateErrorKey,
} from '@/helper/formError/formError.helper';
import { SectionBuilder } from './SectionBuilder.compo';

interface Props {
    open: boolean;
    mode?: 'create' | 'edit';
    /** Chỉ dùng khi mode = 'edit' — thường lấy từ `toFormValues(preparation)` */
    initialValues?: QuestionPreparationForm;
    onClose: () => void;
    onSubmit: (data: QuestionPreparationFormValues) => void | Promise<void>;
    isSubmitting?: boolean;
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
    const txtErr = useTranslations('Shema');

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
        formState: { errors, submitCount },
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


    const errorKeys = collectErrorKeys(errors);
    const showSummary = submitCount > 0 && errorKeys.length > 0;

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>

            <DialogContent className="flex h-[92dvh] w-[95vw] flex-col gap-4 overflow-hidden p-5 sm:max-w-6xl sm:p-6">
                <DialogHeader className="shrink-0 pr-10">
                    <DialogTitle>
                        {titleOverride ??
                            (mode === 'create'
                                ? txt('create_preparation')
                                : txt('edit_preparation'))}
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={submit}
                        className="flex min-h-0 flex-1 flex-col gap-4"
                    >
                        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
                            {showSummary && (
                                <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3">
                                    <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                                        <AlertCircle size={14} />
                                        {txt('form_has_errors')}
                                    </p>
                                    <ul className="mt-1 ml-5 list-disc space-y-0.5 text-xs text-destructive/90">
                                        {errorKeys.map((key) => (
                                            <li key={key}>
                                                {translateErrorKey(txtErr, key)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

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

                            {sections.length === 0 && (
                                <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                                    {txt('no_sections_yet')}
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
                        </div>

                        {/* Hành động — luôn hiện, không bị cuộn mất */}
                        <div className="flex shrink-0 justify-end gap-3 border-t pt-4">
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
