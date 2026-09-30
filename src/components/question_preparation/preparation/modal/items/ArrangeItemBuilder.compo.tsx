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

export function ArrangeItemBuilder({ sectionIndex, itemIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const { control, register } = useFormContext<any>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}`;

    const {
        fields: correctFields,
        append: addCorrect,
        remove: removeCorrect,
    } = useFieldArray({ control, name: `${basePath}.correct` });

    const {
        fields: shuffledFields,
        append: addShuffled,
        remove: removeShuffled,
    } = useFieldArray({ control, name: `${basePath}.shuffled` });

    return (
        <div className="space-y-3 border-t border-dashed border-border pt-3">
            <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {txt('correct_order')}
                </p>
                <div className="flex flex-wrap gap-2">
                    {correctFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-1">
                            <Input
                                register={register(
                                    `${basePath}.correct.${index}`,
                                )}
                                placeholder={`${index + 1}`}
                                inputStyles="w-24 rounded-md border-2 border-status-info p-1.5 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => removeCorrect(index)}
                                className="text-red-600 hover:bg-red-50"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {correctFields.length < 20 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addCorrect('')}
                            className="h-8 gap-1"
                        >
                            <Plus size={12} />
                        </Button>
                    )}
                </div>
            </div>

            <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {txt('shuffled_order')}
                </p>
                <div className="flex flex-wrap gap-2">
                    {shuffledFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-1">
                            <Input
                                register={register(
                                    `${basePath}.shuffled.${index}`,
                                )}
                                placeholder={`${index + 1}`}
                                inputStyles="w-24 rounded-md border-2 border-status-info p-1.5 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => removeShuffled(index)}
                                className="text-red-600 hover:bg-red-50"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {shuffledFields.length < 20 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addShuffled('')}
                            className="h-8 gap-1"
                        >
                            <Plus size={12} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
