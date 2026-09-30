'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/_share/about_form/info_and_input/input.compo';

interface Props {
    sectionIndex: number;
}

export function TimeLimitField({ sectionIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const {
        control,
        formState: { errors },
    } = useFormContext<any>();

    const name = `sections.${sectionIndex}.time_limit`;
    const sectionErrors = (errors.sections as any)?.[sectionIndex];

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const enabled =
                    field.value !== null && field.value !== undefined;

                return (
                    <div className="flex items-center gap-3">
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
                            <input
                                type="checkbox"
                                checked={enabled}
                                onChange={(e) => {
                                    field.onChange(e.target.checked ? 30 : null);
                                }}
                                className="h-4 w-4"
                            />
                            {txt('enable_time_limit')}
                        </label>

                        {enabled && (
                            <div className="w-32">
                                <Input
                                    value={field.value ?? ''}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ''
                                                ? null
                                                : Number(e.target.value),
                                        )
                                    }
                                    error={sectionErrors?.time_limit}
                                    type="number"
                                    placeholder={txt('minutes_placeholder')}
                                />
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );
}
