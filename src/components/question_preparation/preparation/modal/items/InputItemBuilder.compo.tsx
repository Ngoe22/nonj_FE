'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import { RemoveIconButton } from '@/components/_share/icon_button/RemoveIconButton.compo';
import { InvalidInput } from '@/components/_share/form_error_warning/FormErrorWarning.compo';
import { translateErrorKey } from '@/helper/formError/formError.helper';

interface Props {
    sectionIndex: number;
    itemIndex: number;
}

const MIN_ANSWERS = 1;
const MAX_ANSWERS = 10;

/**
 * Soạn câu "điền đáp án".
 *
 * Controlled + `useWatch` (giống ChoseCorrectItemBuilder) để tránh lệch giá trị
 * khi thêm/xoá giữa danh sách.
 */
export function InputItemBuilder({ sectionIndex, itemIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const txtErr = useTranslations('Shema');
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext<any>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}`;
    const answersPath = `${basePath}.correct_answers`;

    const watched = useWatch({ control, name: answersPath });
    const answers: string[] = Array.isArray(watched) ? watched : [];

    const itemErrors = (errors.sections as any)?.[sectionIndex]?.items?.[
        itemIndex
    ];

    /** Lỗi nằm ở `correct_answers[index]`, không phải cấp mảng */
    const answerError = (index: number): string | undefined => {
        const err = itemErrors?.correct_answers;
        if (!err) return undefined;
        if (Array.isArray(err)) return err[index]?.message;
        return err.message;
    };

    const write = (next: string[]) =>
        setValue(answersPath, next, { shouldDirty: true });

    const changeAnswer = (index: number, text: string) =>
        write(answers.map((value, i) => (i === index ? text : value)));

    const addAnswer = () => write([...answers, '']);

    const removeAnswer = (index: number) =>
        write(answers.filter((_, i) => i !== index));

    return (
        <div className="space-y-2 border-t border-dashed border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">
                {txt('correct_answers')}
            </p>

            {answers.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                        <Input
                            value={value ?? ''}
                            onChange={(e) =>
                                changeAnswer(index, e.target.value)
                            }
                            placeholder={`${txt('answer')} ${index + 1}`}
                        />
                        {answerError(index) && (
                            <p className="mt-1 text-xs text-destructive">
                                {translateErrorKey(txtErr, answerError(index)!)}
                            </p>
                        )}
                    </div>
                    {answers.length > MIN_ANSWERS && (
                        <RemoveIconButton
                            onClick={() => removeAnswer(index)}
                            label={txt('remove')}
                        />
                    )}
                </div>
            ))}

            <InvalidInput msg={itemErrors?.correct_answers?.message} />

            {answers.length < MAX_ANSWERS && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                    className="gap-2"
                >
                    <Plus size={13} />
                    {txt('add_answer')}
                </Button>
            )}
        </div>
    );
}
