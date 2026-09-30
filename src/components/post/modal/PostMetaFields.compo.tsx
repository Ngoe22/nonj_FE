'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Retake, View_Each_Other_Answer } from '@/enum/post/post.enum';
import type { PostMetaFormValues } from '@/schemas/post/post.schema';

interface Props {
    /** Sửa post thì KHÔNG cho đổi retake (bài làm cũ phụ thuộc vào nó) */
    hideRetake?: boolean;
    /** Ẩn ô tiêu đề khi đã chọn đề từ kho và muốn giữ nguyên */
    hideTitle?: boolean;
}

const fieldClass =
    'mt-1 w-full rounded-md border-2 border-status-info p-2 text-sm outline-none';

export function PostMetaFields({ hideRetake, hideTitle }: Props) {
    const txt = useTranslations('Post');
    const txtErr = useTranslations('Shema');

    const {
        register,
        formState: { errors },
    } = useFormContext<PostMetaFormValues>();

    /** message của zod là KEY i18n -> dịch sang câu hiển thị */
    const message = (key?: string) => (key ? txtErr(key) : undefined);

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
                        className={fieldClass}
                    />
                    {errors.title?.message && (
                        <p className="mt-1 text-xs text-red-500">
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
                    <p className="mt-1 text-xs text-red-500">
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
                        <select
                            {...register('retake')}
                            className={fieldClass}
                        >
                            <option value={Retake.NEVER}>
                                {txt('retake_never')}
                            </option>
                            <option value={Retake.BEFORE_DATELINE}>
                                {txt('retake_before_deadline')}
                            </option>
                        </select>
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        {txt('view_each_other')}
                    </label>
                    <select
                        {...register('view_each_other_answer')}
                        className={fieldClass}
                    >
                        <option value={View_Each_Other_Answer.NEVER}>
                            {txt('view_never')}
                        </option>
                        <option value={View_Each_Other_Answer.AFTER_ANSWER}>
                            {txt('view_after_answer')}
                        </option>
                        <option value={View_Each_Other_Answer.AFTER_DEADLINE}>
                            {txt('view_after_deadline')}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
}
