'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';

import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import { RemoveIconButton } from '@/components/_share/icon_button/RemoveIconButton.compo';

import { Question_Section_Type } from '@/enum/question_preparation/question_preparation.enum';
import type { QuestionPreparationFormValues } from '@/schemas/question_preparation/question_preparation.schema';
import { QuestionContentEditor } from './QuestionContentEditor.compo';
import { MultipleChoiceSectionBuilder } from './MultipleChoiceSectionBuilder.compo';
import { EssaySectionBuilder } from './EssaySectionBuilder.compo';

interface Props {
    sectionIndex: number;
    onRemove: () => void;
}

export function SectionBuilder({ sectionIndex, onRemove }: Props) {
    const txt = useTranslations('Question_builder');
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<QuestionPreparationFormValues>();

    const basePath = `sections.${sectionIndex}` as const;
    const sectionType = watch(`${basePath}.type`);
    const sectionErrors = (errors.sections as any)?.[sectionIndex];

    const isMultipleChoice =
        sectionType === Question_Section_Type.MULTIPLE_CHOICE;

    return (
        <div className="space-y-4 rounded-2xl border-2 border-border bg-background p-4">
            {/* Đầu mục */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-surface-hover px-3 py-1 text-xs font-medium">
                        {isMultipleChoice
                            ? txt('multiple_choice')
                            : txt('essay')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        #{sectionIndex + 1}
                    </span>
                </div>

                <RemoveIconButton
                    onClick={onRemove}
                    label={txt('remove')}
                    icon={<Trash2 size={15} />}
                />
            </div>

            {/* Tiêu đề phần */}
            <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {txt('section_title')}
                </label>
                <Input
                    register={register(`${basePath}.title`)}
                    error={sectionErrors?.title}
                    placeholder={txt('section_title_placeholder')}
                />
            </div>

            {/* Đề bài chung của phần */}
            <QuestionContentEditor
                namePrefix={`${basePath}.content` as `sections.${number}.content`}
            />

            {/* UI riêng theo loại phần */}
            {isMultipleChoice ? (
                <MultipleChoiceSectionBuilder sectionIndex={sectionIndex} />
            ) : (
                <EssaySectionBuilder sectionIndex={sectionIndex} />
            )}
        </div>
    );
}
