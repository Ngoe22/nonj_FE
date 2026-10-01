'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Info, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import { RemoveIconButton } from '@/components/_share/icon_button/RemoveIconButton.compo';
import { InvalidInput } from '@/components/_share/form_error_warning/FormErrorWarning.compo';
import { translateErrorKey } from '@/helper/formError/formError.helper';

interface Props {
    sectionIndex: number;
    itemIndex: number;
}

const MIN_WORDS = 2;
const MAX_WORDS = 20;

/**
 * Soạn câu "sắp xếp".
 *
 * Người soạn CHỈ nhập thứ tự đúng. Thứ tự hiển thị cho học viên do
 * `shuffleForDisplay` tự xáo lúc lưu (xem types/question_preparation) — không
 * bắt người soạn tự xáo rồi nhập tay.
 */
export function ArrangeItemBuilder({ sectionIndex, itemIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const txtErr = useTranslations('Shema');
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext<any>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}`;
    const correctPath = `${basePath}.correct`;

    const watched = useWatch({ control, name: correctPath });
    const correct: string[] = Array.isArray(watched) ? watched : [];

    const itemErrors = (errors.sections as any)?.[sectionIndex]?.items?.[
        itemIndex
    ];

    /** Lỗi nằm ở `correct[index]`, không phải cấp mảng */
    const wordError = (index: number): string | undefined => {
        const err = itemErrors?.correct;
        if (!err) return undefined;
        if (Array.isArray(err)) return err[index]?.message;
        return err.message;
    };

    const write = (next: string[]) =>
        setValue(correctPath, next, { shouldDirty: true });

    const changeWord = (index: number, text: string) =>
        write(correct.map((value, i) => (i === index ? text : value)));

    const addWord = () => write([...correct, '']);

    const removeWord = (index: number) =>
        write(correct.filter((_, i) => i !== index));

    return (
        <div className="space-y-2 border-t border-dashed border-border pt-3">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                    {txt('correct_order')}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                    <Info size={12} />
                    {txt('arrange_auto_shuffle_hint')}
                </p>
            </div>

            {/*
              MỘT HÀNG NGANG, tràn thì cuộn — không wrap xuống dòng.
              Wrap làm các từ nhảy hàng liên tục, nhìn rất rối khi soạn.
            */}
            <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
                {correct.map((value, index) => (
                    <div
                        key={index}
                        className="flex shrink-0 items-center gap-1"
                    >
                        <span className="w-4 shrink-0 text-center text-[11px] text-muted-foreground">
                            {index + 1}
                        </span>
                        <div className="shrink-0">
                            <Input
                                value={value ?? ''}
                                onChange={(e) =>
                                    changeWord(index, e.target.value)
                                }
                                placeholder={txt('word_placeholder')}
                                inputStyles={`w-32 shrink-0 rounded-md border-2 p-1.5 text-sm ${
                                    wordError(index)
                                        ? 'border-destructive'
                                        : 'border-status-info'
                                }`}
                            />
                            {wordError(index) && (
                                <p className="mt-0.5 w-32 text-[10px] text-destructive">
                                    {translateErrorKey(txtErr, wordError(index)!)}
                                </p>
                            )}
                        </div>
                        {correct.length > MIN_WORDS && (
                            <RemoveIconButton
                                onClick={() => removeWord(index)}
                                label={txt('remove')}
                                className="h-8 w-8"
                            />
                        )}
                    </div>
                ))}

                {correct.length < MAX_WORDS && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addWord}
                        className="h-9 shrink-0 gap-1"
                    >
                        <Plus size={12} />
                        {txt('add_word')}
                    </Button>
                )}
            </div>

            <InvalidInput msg={itemErrors?.correct?.message} />
        </div>
    );
}
