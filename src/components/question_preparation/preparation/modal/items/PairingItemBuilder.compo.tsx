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

export function PairingItemBuilder({ sectionIndex, itemIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const { control, register } = useFormContext<any>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}`;

    const {
        fields: pairs,
        append: addPair,
        remove: removePair,
    } = useFieldArray({ control, name: `${basePath}.pairs` });

    return (
        <div className="space-y-2 border-t border-dashed border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">
                {txt('pairing_pairs')}
            </p>

            {pairs.map((pair, index) => (
                <div key={pair.id} className="flex items-center gap-2">
                    <Input
                        register={register(`${basePath}.pairs.${index}.key`)}
                        placeholder={txt('pair_left')}
                        inputStyles="flex-1 rounded-md border-2 border-status-info p-2 text-sm"
                    />
                    <span className="text-muted-foreground">→</span>
                    <Input
                        register={register(`${basePath}.pairs.${index}.value`)}
                        placeholder={txt('pair_right')}
                        inputStyles="flex-1 rounded-md border-2 border-status-info p-2 text-sm"
                    />
                    {pairs.length > 2 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePair(index)}
                            className="h-8 w-8 text-red-600"
                        >
                            <X size={14} />
                        </Button>
                    )}
                </div>
            ))}

            {pairs.length < 20 && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addPair({ key: '', value: '' })}
                    className="gap-2"
                >
                    <Plus size={13} />
                    {txt('add_pair')}
                </Button>
            )}
        </div>
    );
}
