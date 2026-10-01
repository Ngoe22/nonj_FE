'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';

import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import { RemoveIconButton } from '@/components/_share/icon_button/RemoveIconButton.compo';

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

/**
 * Nhãn hiển thị của từng loại câu.
 * Trước đây chỗ này in thẳng giá trị enum (`itemType.replace('_', ' ')`) nên ra
 * chữ tiếng Anh thô như "chose correct", "arrange" — không theo i18n.
 */
const ITEM_TYPE_LABEL_KEY: Record<string, string> = {
    [Question_Item_Type.CHOSE_CORRECT]: 'item_type_chose_correct',
    [Question_Item_Type.ARRANGE]: 'item_type_arrange',
    [Question_Item_Type.PAIRING]: 'item_type_pairing',
    [Question_Item_Type.INPUT]: 'item_type_input',
};

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
                <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium">
                    {typeof itemType === 'string' && ITEM_TYPE_LABEL_KEY[itemType]
                        ? txt(ITEM_TYPE_LABEL_KEY[itemType])
                        : ''}
                </span>
                <RemoveIconButton
                    onClick={onRemove}
                    label={txt('remove')}
                    className="h-7 w-7"
                    icon={<Trash2 size={14} />}
                />
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
