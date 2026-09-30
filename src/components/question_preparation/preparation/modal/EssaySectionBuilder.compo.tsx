'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import type { QuestionPreparationFormValues } from '@/schemas/question_preparation/question_preparation.schema';

interface Props {
    sectionIndex: number;
}

export function EssaySectionBuilder({ sectionIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const {
        register,
        formState: { errors },
    } = useFormContext<QuestionPreparationFormValues>();

    const basePath = `sections.${sectionIndex}` as const;
    const sectionErrors = (errors.sections as any)?.[sectionIndex];

    return (
        <div className="space-y-3 border-t border-dashed border-border pt-3">
            <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {txt('point')}
                </label>
                <Input
                    register={register(`${basePath}.point`, {
                        valueAsNumber: true,
                    })}
                    error={sectionErrors?.point}
                    type="number"
                    placeholder="10"
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {txt('sample_answer')}
                </label>
                <Input
                    register={register(`${basePath}.sample_answer`)}
                    error={sectionErrors?.sample_answer}
                    type="textarea"
                    placeholder={txt('sample_answer_placeholder')}
                    inputStyles="mt-1 w-full rounded-md border-2 border-status-info p-2 text-sm min-h-[120px] resize-y"
                />
            </div>
        </div>
    );
}
