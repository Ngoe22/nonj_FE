'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';

import { Question_Item_Type } from '@/enum/question_preparation/question_preparation.enum';
import type { QuestionPreparationFormValues } from '@/schemas/question_preparation/question_preparation.schema';
import { ChoseCorrectItemBuilder } from './items/ChoseCorrectItemBuilder.compo';
import { ArrangeItemBuilder } from './items/ArrangeItemBuilder.compo';
import { PairingItemBuilder } from './items/PairingItemBuilder.compo';
import { InputItemBuilder } from './items/InputItemBuilder.compo';

interface Props {
    sectionIndex: number;
    itemIndex: number;
    onRemove: () => void;
}

export function ItemBuilder({ sectionIndex, itemIndex, onRemove }: Props) {
    const txt = useTranslations('Question_builder');
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<QuestionPreparationFormValues>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}` as const;
    const itemType = watch(`${basePath}.type` as any);
    const itemErrors = (errors.sections as any)?.[sectionIndex]?.items?.[
        itemIndex
    ];

    return (
        <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center justify-between">
                <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium uppercase">
                    {typeof itemType === 'string'
                        ? itemType.replace('_', ' ')
                        : ''}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="h-7 w-7 text-red-600 hover:bg-red-50"
                >
                    <Trash2 size={13} />
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        {txt('item_question')}
                    </label>
                    <Input
                        register={register(`${basePath}.question` as any)}
                        error={itemErrors?.question}
                        placeholder={txt('item_question_placeholder')}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        {txt('point')}
                    </label>
                    <Input
                        register={register(`${basePath}.point` as any, {
                            valueAsNumber: true,
                        })}
                        error={itemErrors?.point}
                        type="number"
                    />
                </div>
            </div>

            {itemType === Question_Item_Type.CHOSE_CORRECT && (
                <ChoseCorrectItemBuilder
                    sectionIndex={sectionIndex}
                    itemIndex={itemIndex}
                />
            )}
            {itemType === Question_Item_Type.ARRANGE && (
                <ArrangeItemBuilder
                    sectionIndex={sectionIndex}
                    itemIndex={itemIndex}
                />
            )}
            {itemType === Question_Item_Type.PAIRING && (
                <PairingItemBuilder
                    sectionIndex={sectionIndex}
                    itemIndex={itemIndex}
                />
            )}
            {itemType === Question_Item_Type.INPUT && (
                <InputItemBuilder
                    sectionIndex={sectionIndex}
                    itemIndex={itemIndex}
                />
            )}
        </div>
    );
}
