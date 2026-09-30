'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';

interface Props {
    sectionIndex: number;
    itemIndex: number;
}

export function InputItemBuilder({ sectionIndex, itemIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const { control, register } = useFormContext<any>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}`;

    const {
        fields: answers,
        append: addAnswer,
        remove: removeAnswer,
    } = useFieldArray({ control, name: `${basePath}.correct_answers` });

    return (
        <div className="space-y-2 border-t border-dashed border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">
                {txt('correct_answers')}
            </p>

            {answers.map((answer, index) => (
                <div key={answer.id} className="flex items-center gap-2">
                    <Input
                        register={register(
                            `${basePath}.correct_answers.${index}`,
                        )}
                        placeholder={`${txt('answer')} ${index + 1}`}
                    />
                    {answers.length > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAnswer(index)}
                            className="h-8 w-8 text-red-600"
                        >
                            <X size={14} />
                        </Button>
                    )}
                </div>
            ))}

            {answers.length < 10 && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAnswer('')}
                    className="gap-2"
                >
                    <Plus size={13} />
                    {txt('add_answer')}
                </Button>
            )}
        </div>
    );
}
