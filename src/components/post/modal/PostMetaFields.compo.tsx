'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Retake, View_Each_Other_Answer } from '@/enum/post/post.enum';
import type { PostMetaFormValues } from '@/schemas/post/post.schema';
import { SelectField } from '@/components/_share/about_form/select_field/SelectField.compo';

interface Props {
    /**
     * Giữ lại để tương thích chỗ gọi cũ.
     *
     * Trước đây `PostMetaModal` truyền `hideRetake` khi sửa bài, nên KHÔNG đổi
     * được chế độ làm lại. Thực tế `retake` chỉ ảnh hưởng lượt làm MỚI, không
     * làm lệch bài đã nộp — nên giờ cho sửa (BE `UpdatePostDto` cũng đã nhận).
     */
    hideRetake?: boolean;
    /** Ẩn ô tiêu đề khi đã chọn đề từ kho và muốn giữ nguyên */
    hideTitle?: boolean;
}

const fieldClass =
    'mt-1 w-full rounded-md border-2 border-status-info p-2 text-sm outline-none';

const errorClass =
    'mt-1 w-full rounded-md border-2 border-destructive bg-destructive/5 p-2 text-sm outline-none';

export function PostMetaFields({ hideRetake, hideTitle }: Props) {
    const txt = useTranslations('Post');
    const txtErr = useTranslations('Shema');

    const {
        register,
        formState: { errors },
    } = useFormContext<PostMetaFormValues>();

    /** message của zod là KEY i18n -> dịch sang câu hiển thị */
    const message = (key?: string) => {
        if (!key) return undefined;
        try {
            return txtErr(key);
        } catch {
            return key;
        }
    };

    return (
        <div className="space-y-4">
            {!hideTitle && (
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        {txt('post_title')}
                    </label>
                    <input
                        {...register('title')}
                        placeholder={txt('post_title_placeholder')}
                        aria-invalid={!!errors.title}
                        className={errors.title ? errorClass : fieldClass}
                    />
                    {errors.title?.message && (
                        <p className="mt-1 text-xs text-destructive">
                            {message(errors.title.message)}
                        </p>
                    )}
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium">
                    {txt('post_description')}
                </label>
                <textarea
                    {...register('description')}
                    placeholder={txt('post_description_placeholder')}
                    className={`${fieldClass} min-h-20 resize-y`}
                />
                {errors.description?.message && (
                    <p className="mt-1 text-xs text-destructive">
                        {message(errors.description.message)}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    {txt('deadline')}
                </label>
                <input
                    type="datetime-local"
                    {...register('deadline_at')}
                    className={fieldClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    {txt('deadline_hint')}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {!hideRetake && (
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            {txt('retake')}
                        </label>
                        <SelectField
                            register={register('retake')}
                            options={[
                                {
                                    value: Retake.NEVER,
                                    label: txt('retake_never'),
                                },
                                {
                                    value: Retake.BEFORE_DATELINE,
                                    label: txt('retake_before_deadline'),
                                },
                            ]}
                        />
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        {txt('view_each_other')}
                    </label>
                    <SelectField
                        register={register('view_each_other_answer')}
                        options={[
                            {
                                value: View_Each_Other_Answer.NEVER,
                                label: txt('view_never'),
                            },
                            {
                                value: View_Each_Other_Answer.AFTER_ANSWER,
                                label: txt('view_after_answer'),
                            },
                            {
                                value: View_Each_Other_Answer.AFTER_DEADLINE,
                                label: txt('view_after_deadline'),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
