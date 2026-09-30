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

export function ChoseCorrectItemBuilder({ sectionIndex, itemIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const {
        control,
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<any>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}`;
    const correctOptions: number[] = watch(`${basePath}.correct_options`) ?? [];
    const itemErrors = (errors.sections as any)?.[sectionIndex]?.items?.[
        itemIndex
    ];

    const {
        fields: options,
        append: addOption,
        remove: removeOption,
    } = useFieldArray({ control, name: `${basePath}.options` });

    // Xoá option thì phải dịch lại index trong correct_options, nếu không
    // đáp án sẽ trỏ sai lựa chọn sau khi xoá.
    const handleRemoveOption = (index: number) => {
        const nextCorrect = correctOptions
            .filter((i) => i !== index)
            .map((i) => (i > index ? i - 1 : i));
        removeOption(index);
        setValue(`${basePath}.correct_options`, nextCorrect, {
            shouldDirty: true,
        });
    };

    const toggleCorrect = (index: number) => {
        const next = correctOptions.includes(index)
            ? correctOptions.filter((i) => i !== index)
            : [...correctOptions, index];
        setValue(`${basePath}.correct_options`, next, { shouldDirty: true });
    };

    return (
        <div className="space-y-2 border-t border-dashed border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">
                {txt('options_and_correct')}
            </p>

            {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={correctOptions.includes(index)}
                        onChange={() => toggleCorrect(index)}
                        className="h-4 w-4 shrink-0"
                        title={txt('mark_correct')}
                    />
                    <Input
                        register={register(`${basePath}.options.${index}`)}
                        placeholder={`${txt('option')} ${index + 1}`}
                    />
                    {options.length > 2 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(index)}
                            className="h-8 w-8 text-red-600"
                        >
                            <X size={14} />
                        </Button>
                    )}
                </div>
            ))}

            {itemErrors?.correct_options && (
                <p className="text-xs text-red-500">
                    {itemErrors.correct_options.message}
                </p>
            )}

            {options.length < 10 && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption('')}
                    className="gap-2"
                >
                    <Plus size={13} />
                    {txt('add_option')}
                </Button>
            )}
        </div>
    );
}
