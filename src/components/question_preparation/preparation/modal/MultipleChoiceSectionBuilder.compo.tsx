'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Question_Item_Type } from '@/enum/question_preparation/question_preparation.enum';
import type { QuestionPreparationFormValues } from '@/schemas/question_preparation/question_preparation.schema';
import { createEmptyItem } from '@/types/question_preparation/question_preparation.type';
import { ItemBuilder } from './ItemBuilder.compo';

interface Props {
    sectionIndex: number;
}

export function MultipleChoiceSectionBuilder({ sectionIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const { control } = useFormContext<QuestionPreparationFormValues>();

    const basePath = `sections.${sectionIndex}` as const;

    const {
        fields: items,
        append: addItem,
        remove: removeItem,
    } = useFieldArray({
        control,
        name: `${basePath}.items` as any,
    });

    const itemTypeLabels: { type: Question_Item_Type; key: string }[] = [
        {
            type: Question_Item_Type.CHOSE_CORRECT,
            key: 'item_type_chose_correct',
        },
        { type: Question_Item_Type.ARRANGE, key: 'item_type_arrange' },
        { type: Question_Item_Type.PAIRING, key: 'item_type_pairing' },
        { type: Question_Item_Type.INPUT, key: 'item_type_input' },
    ];

    return (
        <div className="space-y-4 border-t border-dashed border-border pt-3">
            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, itemIndex) => (
                        <ItemBuilder
                            key={item.id}
                            sectionIndex={sectionIndex}
                            itemIndex={itemIndex}
                            onRemove={() => removeItem(itemIndex)}
                        />
                    ))}
                </div>
            )}

            {items.length === 0 && (
                <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                    {txt('no_items_yet')}
                </p>
            )}

            <div className="flex justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="gap-2">
                            <Plus size={14} />
                            {txt('add_item')}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center">
                        {itemTypeLabels.map(({ type, key }) => (
                            <DropdownMenuItem
                                key={type}
                                onClick={() =>
                                    addItem(createEmptyItem(type) as any)
                                }
                            >
                                {txt(key)}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
