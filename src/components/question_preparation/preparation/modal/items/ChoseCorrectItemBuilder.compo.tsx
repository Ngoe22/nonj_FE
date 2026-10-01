'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Check, Plus } from 'lucide-react';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import { RemoveIconButton } from '@/components/_share/icon_button/RemoveIconButton.compo';
import { InvalidInput } from '@/components/_share/form_error_warning/FormErrorWarning.compo';
import { translateErrorKey } from '@/helper/formError/formError.helper';

interface Props {
    sectionIndex: number;
    itemIndex: number;
}

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 10;

/**
 * Soạn câu "chọn đáp án đúng".
 *
 * Toàn bộ ô nhập ở đây là CONTROLLED và đọc bằng `useWatch` — đây là điểm quan
 * trọng nhất của component:
 *
 *  - `useWatch` đăng ký theo dõi đúng path và LUÔN re-render khi giá trị đổi.
 *    Trước đây dùng `watch` kèm `useFieldArray` nên tick vào đáp án đúng không
 *    thấy phản ứng gì cho tới khi thêm một lựa chọn mới.
 *  - Ô nhập là controlled nên khi xoá một lựa chọn ở giữa, các ô còn lại hiển
 *    thị đúng giá trị mới (không bị lệch như input uncontrolled + field array).
 */
export function ChoseCorrectItemBuilder({ sectionIndex, itemIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const txtErr = useTranslations('Shema');
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext<any>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}`;
    const optionsPath = `${basePath}.options`;
    const correctPath = `${basePath}.correct_options`;

    const watchedOptions = useWatch({ control, name: optionsPath });
    const watchedCorrect = useWatch({ control, name: correctPath });

    const options: string[] = Array.isArray(watchedOptions)
        ? watchedOptions
        : [];
    const correctOptions: number[] = Array.isArray(watchedCorrect)
        ? watchedCorrect
        : [];

    const itemErrors = (errors.sections as any)?.[sectionIndex]?.items?.[
        itemIndex
    ];

    /**
     * Lỗi của MỘT lựa chọn nằm ở `options[index]`, không phải ở cấp mảng — nên
     * trước đây để trống ô lựa chọn thì không hiện cảnh báo gì dù không lưu được.
     */
    const optionError = (index: number): string | undefined => {
        const err = itemErrors?.options;
        if (!err) return undefined;
        if (Array.isArray(err)) return err[index]?.message;
        return err.message;
    };

    const writeOptions = (next: string[]) =>
        setValue(optionsPath, next, { shouldDirty: true });

    const writeCorrect = (next: number[]) =>
        setValue(correctPath, next, { shouldDirty: true });

    const changeOption = (index: number, text: string) =>
        writeOptions(
            options.map((value, i) => (i === index ? text : value)),
        );

    const addOption = () => writeOptions([...options, '']);

    /**
     * Xoá một lựa chọn PHẢI dịch lại index trong `correct_options`, nếu không
     * đáp án đúng sẽ trỏ sang lựa chọn khác sau khi xoá.
     */
    const removeOption = (index: number) => {
        writeOptions(options.filter((_, i) => i !== index));
        writeCorrect(
            correctOptions
                .filter((i) => i !== index)
                .map((i) => (i > index ? i - 1 : i)),
        );
    };

    const toggleCorrect = (index: number) => {
        const next = correctOptions.includes(index)
            ? correctOptions.filter((i) => i !== index)
            : [...correctOptions, index].sort((a, b) => a - b);
        writeCorrect(next);
    };

    return (
        <div className="space-y-2 border-t border-dashed border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground flex  items-center gap-3 ">
                {txt('options_and_correct')}
                <InvalidInput msg={itemErrors?.correct_options?.message} style={' '} />

            </p>

            {options.map((value, index) => {
                const isCorrect = correctOptions.includes(index);

                return (
                    <div key={index} className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => toggleCorrect(index)}
                            title={txt('mark_correct')}
                            aria-pressed={isCorrect}
                            className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2',
                                'text-xs font-medium transition-colors',
                                isCorrect
                                    ? 'border-status-success bg-status-success-bg text-status-success'
                                    : 'border-border text-muted-foreground/45 hover:border-status-success/60 hover:text-status-success/70',
                            )}
                        >
                            {isCorrect ? (
                                <Check size={16} />
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </button>

                        <div className="min-w-0 flex-1">
                            <Input
                                value={value ?? ''}
                                onChange={(e) =>
                                    changeOption(index, e.target.value)
                                }
                                placeholder={`${txt('option')} ${index + 1}`}
                            />
                            {optionError(index) && (
                                <p className="mt-1 text-xs text-destructive">
                                    {translateErrorKey(
                                        txtErr,
                                        optionError(index)!,
                                    )}
                                </p>
                            )}
                        </div>

                        {options.length > MIN_OPTIONS && (
                            <RemoveIconButton
                                onClick={() => removeOption(index)}
                                label={txt('remove')}
                            />
                        )}
                    </div>
                );
            })}


            {options.length < MAX_OPTIONS && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="gap-2"
                >
                    <Plus size={13} />
                    {txt('add_option')}
                </Button>
            )}
        </div>
    );
}
